import { Cell, CellType } from "./cell";

export class NormalCell extends Cell {

    constructor(id: string, weight: number, x: number, y: number, owner?: string) {
        super(id, CellType.Normal, weight, x, y)
        this.owner = owner
    }

    update() {
        // decimate if over 200
        if (this.weight > 200) {
            this.weight -= Math.floor(this.weight * 0.01)
            return
        }

        if (!this.owner) {
            this.weight += Math.random() < 0.1 ? 1 : 0
            return
        }

        if (this.weight > 50 && this.weight < 150) {
            this.weight += 3
        } else {
            this.weight += 2
        }
    }
}