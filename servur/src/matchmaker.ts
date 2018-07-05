import * as uuid from 'uuid/v4'
import { EventEmitter } from 'events'

import { Player, Team } from './player';
import { GameMode } from './game';

export class Matchmaker extends EventEmitter {
    queue: Player[] = []

    enqueue(player: Player, mode: GameMode = GameMode.Normal) {
        console.log(`[Matchmaker][${mode}] enqueue:`, JSON.stringify(player))
        if (this.queue.length <= 0) {
            this.queue.push(player)
            return
        }

        const oponent = this.queue.shift()

        console.log('[Matchmaker] matched:', JSON.stringify([player, oponent]))
        this.emit('match', [
            <Team>{
                id: uuid(),
                players: [player]
            },
            <Team>{
                id: uuid(),
                players: [oponent]
            }
        ])
    }

    dequeue(player: Player) {
        console.log('[Matchmaker] dequeue:', JSON.stringify(player))
        this.queue = this.queue.filter((p: Player) => p !== player)
    }
}