import { Socket } from 'socket.io'

export enum PlayerEvent {
    Initialize = 'initialize',
    Update = 'update',
    End = 'end',

    Transfer = 'transfer',
}

export interface TransferPayload {
    from: string
    to: string
}

export class Player {
    name: string
  
    constructor(public socket: Socket) {
    }

    toJSON() {
        return {
            name: this.name,
        }
    }
  
    onDisconnect() {
  
    }
}