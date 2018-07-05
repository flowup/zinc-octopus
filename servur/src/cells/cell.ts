
export enum CellType {
    Normal = 'normal',
    Mother = 'mother',
    Challenge = 'challenge'
}

export abstract class Cell {
    constructor(
        public id: string,
        public type: CellType,
        public weight: number,
        public x: number,
        public y: number
    ) {

    }
    
    owner?: string

    abstract update()
}