import { Component } from '@angular/core';
import { Observable } from 'rxjs/index';
import { AppStateModel } from '../../models/app-state.model';
import { Store } from '@ngrx/store';
import { CellModel, CellType } from '../../models/cell.model';
import { $myCells, $neutralCells, $theirCells } from '../../reducers/cell.reducer';
import { $transferAnimations } from '../../reducers/transfer.reducer';
import { SendTransferAction } from '../../misc/actions';
import { TransferAnimationModel } from '../../models/transfer-animation.model';

@Component({
  selector: 'zo-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  readonly CellType = CellType;

  selectedCell: string | null = null;

  readonly myCells$: Observable<CellModel[]>;
  readonly theirCells$: Observable<CellModel[]>;
  readonly neutralCells$: Observable<CellModel[]>;
  readonly transferAnimations$: Observable<TransferAnimationModel[]>;

  identifyCell = (_, cell: CellModel) => cell.id;
  identifyTransfer = (_, {transferId}: TransferAnimationModel) => transferId;

  constructor(private readonly store: Store<AppStateModel>) {
    this.myCells$ = this.store.select($myCells);
    this.theirCells$ = this.store.select($theirCells);
    this.neutralCells$ = this.store.select($neutralCells);
    this.transferAnimations$ = this.store.select($transferAnimations);
  }

  sendTransfer(cell: CellModel, whose: 'mine' | 'theirs' | 'neutral'): void {
    console.log(this.selectedCell, whose);
    if (this.selectedCell == null) {
      if (whose === 'mine') {
        this.selectedCell = cell.id;
      }
      return;
    }

    this.store.dispatch(new SendTransferAction({
      from: this.selectedCell,
      to: cell.id
    }));
    this.selectedCell = null;
  }
}
