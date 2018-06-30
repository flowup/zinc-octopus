import { CellModel } from './cell.model';
import { TransferModel } from './transfer.model';
import { PlayerModel } from './player.model';
import { IdMap } from '../misc/utils';
import { MeModel } from './me.model';

export interface AppStateModel {
  players: IdMap<PlayerModel>;
  cells: IdMap<CellModel>;
  transfers: IdMap<TransferModel>;
  me: MeModel;
}
