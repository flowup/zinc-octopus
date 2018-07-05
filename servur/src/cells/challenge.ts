import { Cell, CellType } from "./cell";

export class ChallengeCell extends Cell {

    constructor(id: string, weight: number, x: number, y: number) {
        super(id, CellType.Challenge, weight, x, y)
    }

    update() {
        
    }
}