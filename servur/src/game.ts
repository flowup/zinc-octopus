import { Player, PlayerEvent, TransferPayload } from "./player";
import * as uuid from 'uuid/v4'

export interface Cell {
    id: string
    owner?: string
    weight: number

    x: number
    y: number
}

export enum GameEvents {
    Initialize = 'initialize',

    PlayersUpsert = 'game.players.upsert',
    PlayersDelete = 'game.players.delete',

    CellsUpsert = 'game.cells.upsert',
    CellsDelete = 'game.cells.delete',

    TransfersUpsert = 'game.transfers.upsert',
    TransfersDelete = 'game.transfers.delete',
}

export interface Transfer {
    id: string
    from: string
    to: string

    owner: string
    weight: number

    start: number
    end: number
}

export interface Map {
    name: string
    numberOfPlayers: number,
    playerCells: Cell[]
    neutralCells: Cell[]
}

export const Maps: (() => Map)[] = [
    () => ({
        name: 'Gold Airedale',
        numberOfPlayers: 2,
        playerCells: [
            { id: uuid(), x: 0.1, y: 0.1, weight: 100, owner: 'squid' },
            { id: uuid(), x: 0.9, y: 0.9, weight: 100, owner: 'octopus' },
        ],
        neutralCells: [
            // left top
            { id: uuid(), x: 0.35, y: 0.1, weight: 50 },
            { id: uuid(), x: 0.35, y: 0.35, weight: 50 },
            { id: uuid(), x: 0.1, y: 0.35, weight: 75 },

            // center
            { id: uuid(), x: 0.5, y: 0.5, weight: 50 },

            // right bottom
            { id: uuid(), x: 0.65, y: 0.65, weight: 75 },
            { id: uuid(), x: 0.9, y: 0.65, weight: 50 },
            { id: uuid(), x: 0.65, y: 0.9, weight: 50 },
        ]
    }),
    () => ({
        name: 'The Arena',
        numberOfPlayers: 2,
        playerCells: [
            { id: uuid(), x: 0.03, y: 0.2, weight: 100 },
            { id: uuid(), x: 0.98, y: 0.95, weight: 100 },
        ],
        neutralCells: []
    })
]

export interface GameStatistics {

}

export enum GameMode {
    Normal = 'gamemode.normal',
    AI = 'gamemode.ai'
}

export enum GameStatus {
    Initialized = 'initialized',
    Running = 'running',
    Ended = 'ended'
}

export class Game {
    id: string = uuid()
    cells: Cell[] = []
    transfers: Transfer[] = []

    status = GameStatus.Initialized

    updater: NodeJS.Timer

    constructor(private players: Player[]) {
        this.cells = this.generateMap()

        this.updater = setInterval(this.update.bind(this), 500)
    }

    start() {
        console.log(`[Game][${this.id}] Starting new game:`, JSON.stringify(this.players))
        this.status = GameStatus.Running

        this.players.forEach(p => {
            p.socket.on(PlayerEvent.Transfer, (payload: TransferPayload) => {
                console.log(`[Game][${this.id}] Creating new transfer by player: `, p.name, payload)
                this.handleTransfer(payload, p)
            })

            p.socket.on('disconnect', () => {
                console.log(`[Game][${this.id}] player disconnected:`, JSON.stringify(p))
                this.handleDisconnect(p)
            })

            p.socket.emit(GameEvents.Initialize, {
                id: p.id,
                name: p.name
            })

            p.socket.emit(GameEvents.PlayersUpsert, this.players)
            p.socket.emit(GameEvents.CellsUpsert, this.cells)
        })
    }

    handleTransfer(t: TransferPayload, player: Player): boolean {
        const from = this.cells.find(c => c.id == t.from)
        const to = this.cells.find(c => c.id == t.to)

        // find both cells
        if (!from || !to) {
            return false
        }

        if (from === to) {
            return false
        }

        // ignore non-matching owners
        if (player && player.name !== from.owner) {
            return false
        }

        const distance = Math.sqrt(Math.pow(from.x-to.x, 2) + Math.pow(from.y-to.y, 2))
        const time = distance * 7 // 10% of playground in 1.5 second

        const start = Date.now()
        const transferWeight = Math.floor(from.weight / 2)

        this.transfers.push(<Transfer>{
            id: uuid(),
            from: from.id,
            to: to.id,
            owner: from.owner,
            weight: transferWeight,
            start: start,
            end:  start + time * 1000
        })

        // decrease the weight of the cell we sent from.
        from.weight -= transferWeight

        return true
    }

    handleDisconnect(player: Player): boolean {
        this.players = this.players.filter(p => p !== player)

        if (this.players.length < 2) {
            this.end()
        }

        return true
    }

    end() {
        // skip end ceremony if it was already emited
        if (this.status === GameStatus.Ended) {
            return
        }

        console.log(`[Game][${this.id}] Ending game for all`)
        this.status = GameStatus.Ended

        // TODO: calculate winner - everybody is a winner now :partyparrot:
        for (const p of this.players) {
            p.socket.emit(PlayerEvent.End, {
                winner: p.name,
            })
            // remove disconnect listener
            p.socket.off('disconnect', () => {})
            p.socket.disconnect()
        }

        clearInterval(this.updater)
    }

    update() {
        for (const c of this.cells) {
            if (c.owner) this.updateOwnerCell(c)
            else this.updateNeutralCell(c)
        }

        const doneTransfers = []
        for (const t of this.transfers) {
            if (Date.now() < t.end) continue

            const defense = this.cells.find(c => c.id === t.to)

            const attacker = t.owner
            const deffender = defense.owner
            
            // attack or add more resources if send from the same player
            defense.weight = attacker === deffender ? defense.weight + t.weight : defense.weight - t.weight
             
            // convert the node if it was taken
            if (defense.weight < 0) {
                defense.weight = Math.abs(defense.weight)
                defense.owner = this.cells.find(c => c.id === t.from).owner
            }

            // remove current transfer after it was processed
            this.transfers = this.transfers.filter(tr => tr !== t)
            doneTransfers.push(t.id)
        }

        for (const p of this.players) {
            p.socket.emit(GameEvents.TransfersUpsert, this.transfers)
            p.socket.emit(GameEvents.CellsUpsert, this.cells)
            p.socket.emit(GameEvents.TransfersDelete, doneTransfers)
        }
    }

    updateOwnerCell(c: Cell) {
        if (c.weight > 200) {
            c.weight -= Math.floor(c.weight * 0.01)
        } else if (c.weight > 150) {
            c.weight += 2
        } else if (c.weight > 50) {
            c.weight += 3
        } else {
            c.weight += 2
        }
    }

    updateNeutralCell(c: Cell) {
        if (c.weight > 100) {
            this.handleTransfer({
                from: c.id,
                to: this.cells[Math.floor(Math.random()*this.cells.length)].id,
            }, null)
        } else if(Math.random() < 0.3) {
            c.weight += 1
        }
    }

    private generateMap(): Cell[] {
        const instance = Maps[0]()

        for (let i = 0; i < instance.numberOfPlayers; i++) {
            instance.playerCells[i].owner = this.players[i].name
        }

        return instance.neutralCells.concat(instance.playerCells)
    }
}
