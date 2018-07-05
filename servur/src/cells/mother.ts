import { Cell, CellType } from "./cell";

export class MotherCell extends Cell {

    constructor(id: string, weight: number, x: number, y: number, owner: string) {
        super(id, CellType.Mother, weight, x, y)
        this.owner = owner
    }

    update() {
        // decimate if over 300
        if (this.weight > 300) {
            this.weight -= Math.floor(this.weight * 0.01)
            return
        }

        // if no owner was assigned, up by 1
        if (!this.owner) {
            this.weight += 1
            return
        }

        this.weight += 4
    }
}