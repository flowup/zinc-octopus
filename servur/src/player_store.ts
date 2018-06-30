import { Player } from "./player";

/**
 * PlayerStore is a singleton instance of all connected players
 */
class PlayerStore {
    players: Player[] = []

    add(p: Player) {
        this.players.push(p)
    }

    remove(p: Player) {
        this.players.splice(this.players.indexOf(p), 1)
    }
}

export const Players = new PlayerStore()