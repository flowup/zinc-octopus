import { CellModel } from './cell.model';
import { TransferModel } from './transfer.model';
import { PlayerModel } from './player.model';
import { IdMap } from '../misc/utils';

export interface AppStateModel {
  players: IdMap<PlayerModel>;
  cells: IdMap<CellModel>;
  transfers: IdMap<TransferModel>;
  me: string | null;
}
