export enum TransferOwner {
  None = 'None',
  Me = 'Me',
  Friend = 'Friend',
  Enemy = 'Enemy',
}

export interface TransferAnimationModel {
  transferId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  startTime: number;
  endTime: number;
  owner: TransferOwner;
  weight: number;
}
