import { TransferModel } from './transfer.model';
import { CellModel } from './cell.model';
import { PlayerModel } from './player.model';

export interface UpdateEventModel {
  cells: CellModel[];
  transfers: TransferModel[];
  players: [PlayerModel, PlayerModel];
  me: string;
}
