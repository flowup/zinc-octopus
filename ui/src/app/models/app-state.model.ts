import { CellModel } from './cell.model';
import { TransferModel } from './transfer.model';

export interface AppStateModel {
  cells: CellModel[];
  transfers: TransferModel[];
}
