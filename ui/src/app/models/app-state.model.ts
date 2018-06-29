import { CellModel } from './cell.model';
import { TransferModel } from './transfer.model';
import { PlayerModel } from './player.model';
import { PlayerMapModel } from './player-map.model';

export interface AppStateModel {
  cells: CellModel[];
  transfers: TransferModel[];
  players: PlayerMapModel;
}
