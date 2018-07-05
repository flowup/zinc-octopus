import { Player, PlayerEvent, TransferPayload } from "./player";
import * as uuid from 'uuid/v4'
import { firestore } from "firebase-admin";

export enum CellType {
    Normal = 'normal',
    Mother = 'mother',
    Challenge = 'challenge'
}

export interface Cell {
    id: string
    owner?: string
    weight: number
    type: CellType

    x: number
    y: number
}

export enum GameEvents {
    Initialize = 'initialize',
    Start = 'start',

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
    boostCells: Cell[]
}

export const Maps: (() => Map)[] = [
    () => ({
        name: 'Gold Airedale',
        numberOfPlayers: 2,
        playerCells: [
            { id: uuid(), x: 0.1, y: 0.1, weight: 100, type: CellType.Mother },
            { id: uuid(), x: 0.9, y: 0.9, weight: 100, type: CellType.Mother },
        ],
        neutralCells: [
            // left top
            { id: uuid(), x: 0.35, y: 0.1, weight: 50, type: CellType.Normal },
            { id: uuid(), x: 0.35, y: 0.35, weight: 75, type: CellType.Normal },
            { id: uuid(), x: 0.1, y: 0.35, weight: 50, type: CellType.Normal },

            // center
            { id: uuid(), x: 0.5, y: 0.5, weight: 50, type: CellType.Normal },

            // right bottom
            { id: uuid(), x: 0.65, y: 0.65, weight: 75, type: CellType.Normal },
            { id: uuid(), x: 0.9, y: 0.65, weight: 50, type: CellType.Normal },
            { id: uuid(), x: 0.65, y: 0.9, weight: 50, type: CellType.Normal },
        ],
        boostCells: []
    }),
    () => ({
        name: 'The Arena',
        numberOfPlayers: 2,
        playerCells: [
            { id: uuid(), x: 0.03, y: 0.2, weight: 100, type: CellType.Mother },
            { id: uuid(), x: 0.98, y: 0.95, weight: 100, type: CellType.Mother },
        ],
        neutralCells: [],
        boostCells: []
    })
]

export interface GameStatistics {

}

export enum GameMode {
    Normal = 'gamemode.normal',
    AI = 'gamemode.ai'
}

export enum GameStatus {
    Uninitialized = 'uninitialized',
    Initialized = 'initialized',
    Started = 'started',
    Running = 'running',
    Ended = 'ended'
}

export class Game {
    id: string = uuid()
    cells: Cell[] = []
    transfers: Transfer[] = []

    _status = GameStatus.Uninitialized

    set status(s: GameStatus) {
        this._status = s

        console.log(`[Game][${this.id}] Changed status to:`, this._status)
    }

    get status(): GameStatus {
        return this._status
    }

    updater: NodeJS.Timer

    constructor(private players: Player[]) {
        this.cells = this.generateMap()
    }

    initialize() {
        console.log(`[Game][${this.id}] Starting new game:`, JSON.stringify(this.players))

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
                name: p.name,
                startsAt: Math.round((new Date()).getTime() / 1000) + 5
            })

            p.socket.emit(GameEvents.PlayersUpsert, this.players)
            p.socket.emit(GameEvents.CellsUpsert, this.cells)
        })

        setTimeout(this.start.bind(this), 5000)
        this.status = GameStatus.Initialized
    }

    start() {
        this.players.forEach(p => {
            p.socket.emit(GameEvents.Start, {})
        })

        this.updater = setInterval(this.update.bind(this), 500)
        this.status = GameStatus.Running
    }

    handleTransfer(t: TransferPayload, player: Player): boolean {
        if (this.status !== GameStatus.Running) {
            return false
        }

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
        if (player && player.id !== from.owner) {
            return false
        }

        const distance = Math.sqrt(Math.pow(from.x-to.x, 2) + Math.pow(from.y-to.y, 2))
        const time = distance * 5 // 10% of playground in 1.5 second

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

        if (this.players.length < 2 && this.players.length > 0) {
            this.end(this.players[0].id)
        }

        return true
    }

    end(winner: string) {
        // skip end ceremony if it was already emited
        if (this.status === GameStatus.Ended) {
            return
        }

        console.log(`[Game][${this.id}] Ending game for all:`, JSON.stringify(this.players))
        this.status = GameStatus.Ended

        // TODO: calculate winner - everybody is a winner now :partyparrot:
        for (const p of this.players) {
            p.socket.emit(PlayerEvent.End, {
                winner,
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

            if (doneTransfers.length > 0) {
                p.socket.emit(GameEvents.TransfersDelete, doneTransfers)
            }
        }

        if (this.calculateEndingCondition()) {
            for (const p of this.players) {
                p.socket.emit(GameEvents.TransfersDelete, this.transfers.reduce((acc, t) => {
                    acc.push(t.id)
                    return acc
                }, []))
            }

            const stats = this.updateFirestoreStatistics()
            this.end(stats.winner)
        }
    }

    calculateEndingCondition(): boolean {
        const stats = this.cells.reduce((acc, c) => {
            if (!c.owner) return acc

            acc[c.owner] = (acc[c.owner] || 0) + 1
            return acc
        }, {})

        // last player standing and no transactions by other players
        if (Object.keys(stats).length <= 1 && this.transfers.filter(x => x.owner).length <= 0) {
            return true
        }

        return false
    }

    updateFirestoreStatistics() {
        const stats = {
            players: this.players.reduce((acc, p) => {
                acc.push(p.id)
                return acc
            },[]),
            winner: this.cells.find(c => c.owner !== null && c.owner !== undefined).owner,
            cells: this.cells
        }

        firestore().collection('matches').add(stats)

        return stats
    }

    updateOwnerCell(c: Cell) {
        if (c.weight > 200) {
            c.weight -= Math.floor(c.weight * 0.01)
            return
        }

        switch (c.type) {
            case CellType.Normal:
             if (c.weight > 150) {
                c.weight += 2
            } else if (c.weight > 50) {
                c.weight += 3
            } else {
                c.weight += 2
            }
            break

            case CellType.Mother:
            c.weight += 4
            break
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
            instance.playerCells[i].owner = this.players[i].id
        }

        return instance.neutralCells.concat(instance.playerCells)
    }
}
