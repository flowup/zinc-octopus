import { Server, Socket } from 'socket.io'
import { auth } from 'firebase-admin'

import * as uuid from 'uuid/v4'
import * as faker from 'faker'

import { Matchmaker } from './matchmaker';
import { Player, PlayerEvent } from './player';
import { Game } from './game';
import { Players } from './player_store';

export interface PlayerJoinPayload {
    idToken: string
}

export enum LobbyEvents {
    PlayerEnqueued = 'lobby.players.enqueued',
    PlayerDequeued = 'lobby.players.dequeued'
}

export class Lobby {
    matchmaker = new Matchmaker()

    constructor(private io: Server) {
        this.io.on('connection', this.handleConnection.bind(this))

        this.matchmaker.on('match', this.handleMatchFound.bind(this))
    }

    handleConnection(socket: Socket) {
        const player = new Player(socket)
        Players.add(player)

        player.socket.on(PlayerEvent.Join, this.handlePlayerJoined.bind(this, player))
        player.socket.on('disconnect', () => {
            Players.remove(player)
            this.matchmaker.dequeue(player)
        })
    }

    async handlePlayerJoined(player: Player, msg: PlayerJoinPayload) {
        if (!msg.idToken) {
            return player.socket.emit('status', 'Please provide your token')
        }

        try {
            const token = await auth().verifyIdToken(msg.idToken)
            // assign id to the player
            player.id = token.uid
            
            // assign user name
            const user = await auth().getUser(token.uid)
            player.name = user.displayName || user.email || faker.name.findName()

            // tell client we accepted him
            player.socket.emit(LobbyEvents.PlayerEnqueued, player)
            return this.matchmaker.enqueue(player)
        } catch (err) {
            return player.socket.emit('status', 'Your id token is invalid: ' + err)
        }
    }

    handleMatchFound(players) {
        const game = new Game(players)
        game.initialize()
    }
}