import { Socket } from 'socket.io'

export enum PlayerEvent {
    Join = 'join',

    Update = 'update',
    End = 'end',

    Transfer = 'transfer',
}

export interface TransferPayload {
    from: string
    to: string
}

export class Player {
    id: string = 'unknown'
    name: string = 'unknown'
    team: Team
  
    constructor(public socket: Socket) {
    }

    toJSON() {
        return {
            id: this.id,
            team: this.team && this.team.id || 'unknown',
            name: this.name,
            authenticated: this.authenticated,
        }
    }

    get authenticated(): boolean {
        return this.id !== null && this.id !== undefined && this.id !== ''
    }
  
    onDisconnect() {
  
    }
}

export interface Team {
    id: string
    players: Player[]
}