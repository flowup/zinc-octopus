import * as uuid from 'uuid/v4'
import { EventEmitter } from 'events'

import { Player, Team } from './player';
import { GameMode } from './game';

export class Matchmaker extends EventEmitter {
    queue: Player[] = []
    queue2v2: Player[] = []

    enqueue(player: Player, mode: GameMode = GameMode.Normal) {
        console.log(`[Matchmaker][${mode}] enqueue 1v1:`, JSON.stringify(player))
        if (this.queue.length <= 0) {
            this.queue.push(player)
            return
        }

        const oponent = this.queue.shift()

        this.emit('match', [
            this.attachToTeam(player, null),
            this.attachToTeam(oponent, null)
        ])
        console.log('[Matchmaker] matched 1v1:', JSON.stringify([player, oponent]))
    }

    enqueue2v2(player: Player, mode: GameMode = GameMode.Normal) {
        console.log(`[Matchmaker][${mode}] enqueue 2v2:`, JSON.stringify(player))
        if (this.queue2v2.length < 3) {
            return this.queue2v2.push(player)
        }

        const alphaPlayers = [this.queue2v2.shift(), this.queue2v2.shift()]
        const betaPlayers = [this.queue2v2.shift(), player]

        const alpha = alphaPlayers.reduce((team, p) => this.attachToTeam(p, team), <Team>null)
        const beta = betaPlayers.reduce((team, p) => this.attachToTeam(p, team), <Team>null)

        console.log('[Matchmaker] matched 2v2:', JSON.stringify([alpha, beta]))
        return this.emit('match', [
            alpha, beta
        ])
    }

    attachToTeam(player: Player, team: Team): Team {
        if (!team) {
            const team = {
                id: uuid(),
                players: [player]
            }
            player.team = team
            return team
        } else {
            team.players.push(player)
            player.team = team
            return team
        }
    }

    dequeue(player: Player) {
        console.log('[Matchmaker] dequeue:', JSON.stringify(player))
        this.queue = this.queue.filter((p: Player) => p !== player)
        this.queue2v2 = this.queue2v2.filter((p: Player) => p !== player)
    }
}