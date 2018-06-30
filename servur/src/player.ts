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
    id: string
    name: string

    authenticated = false
  
    constructor(public socket: Socket) {
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            authenticated: this.authenticated,
        }
    }
  
    onDisconnect() {
  
    }
}