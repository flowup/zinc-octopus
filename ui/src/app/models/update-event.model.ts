import { TransferModel } from './transfer.model';
import { CellModel } from './cell.model';

export interface UpdateEventModel {
  cells: CellModel[];
  transfers: TransferModel[];
}
