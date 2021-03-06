export enum CellType {
  Normal = 'normal',
  Mother = 'mother',
}

export interface CellModel {
  id: string;
  owner: string | null;
  weight: number;
  x: number;
  y: number;
  type: CellType;
  friendly?: boolean;
}
