import { EventEmitter } from 'events'
import { Player } from './player';

export class Matchmaker extends EventEmitter {
    queue: Player[] = []

    enqueue(player: Player) {
        console.log('New player enqueued')
        if (this.queue.length <= 0) {
            this.queue.push(player)
            return
        }

        const oponent = this.queue.shift()

        // just for now
        player.name = 'squid'
        oponent.name = 'octopus'

        this.emit('match', [player, oponent])
    }

    dequeue(player: Player) {
        console.log('Player dequeued')
        this.queue = this.queue.filter((p: Player) => p !== player)
    }
}