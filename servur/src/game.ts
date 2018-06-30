import { Player, PlayerEvent, TransferPayload } from "./player";
import * as uuid from 'uuid/v4'
import * as sampler from 'poisson-disc-sampler'

export interface Cell {
    id: string

    x: number
    y: number
    weight: number

    owner?: string
}

export interface Transfer {
    from: string
    to: string

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

export const Maps: Map[] = [
    {
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
    },
    {
        name: 'The Arena',
        numberOfPlayers: 2,
        playerCells: [
            { id: uuid(), x: 0.03, y: 0.2, weight: 100, owner: 'squid' },
            { id: uuid(), x: 0.98, y: 0.95, weight: 100, owner: 'octopus' },
        ],
        neutralCells: []
    }
]

export interface GameStatistics {

}

export class Game {
    cells: Cell[] = []
    transfers: Transfer[] = []

    updater: NodeJS.Timer

    constructor(private players: Player[]) {
        this.cells = this.generateMap()

        this.updater = setInterval(this.update.bind(this), 500)
    }

    start() {
        console.log('Starting new game')

        this.players.forEach(p => {
            p.socket.on(PlayerEvent.Transfer, (payload: TransferPayload) => {
                console.log('Creating new transfer by player: ', p.name, payload)
                this.handleTransfer(payload, p)
            })

            p.socket.on('disconnect', () => {
                this.handleDisconnect(p)
            })
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
        if (player.name !== from.owner) {
            return false
        }

        const distance = Math.sqrt(Math.pow(from.x-to.x, 2) + Math.pow(from.y-to.y, 2))
        const time = distance * 7 // 10% of playground in 1.5 second

        const start = Date.now()
        const transferWeight = Math.floor(from.weight / 2)

        this.transfers.push(<Transfer>{
            from: from.id,
            to: to.id,
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
        console.log('Ending the game')

        // TODO: calculate winner - everybody is a winner now :partyparrot:
        for (const p of this.players) {
            p.socket.emit(PlayerEvent.End, {
                winner: p.name,
            })
            p.socket.disconnect()
        }

        clearInterval(this.updater)
    }

    update() {
        for (const c of this.cells) {
            if (!c.owner) continue

            if (c.weight > 200) {
                c.weight -= Math.floor(c.weight * 0.01)
            } else if (c.weight > 150) {
                c.weight += 1
            } else if (c.weight > 50) {
                c.weight += 2
            } else {
                c.weight += 1
            }
        }

        for (const t of this.transfers) {
            if (Date.now() < t.end) continue

            const defense = this.cells.find(c => c.id === t.to)

            const attacker = this.cells.find(c => c.id === t.from).owner
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
        }

        for (const p of this.players) {
            p.socket.emit(PlayerEvent.Update, {
                players: this.players,
                cells: this.cells,
                transfers: this.transfers,
                me: p.name,
            })
        }
    }

    private generateMap(): Cell[] {
        return Maps[0].playerCells.concat(Maps[0].neutralCells)
    }
}
