import { CellModel } from './cell.model';
import { TransferModel } from './transfer.model';
import { IdMap } from '../misc/utils';
import { MeModel } from './me.model';
import { TeamModel } from './team.model';

export interface AppStateModel {
  teams: IdMap<TeamModel>;
  cells: IdMap<CellModel>;
  transfers: IdMap<TransferModel>;
  me: MeModel;
}
