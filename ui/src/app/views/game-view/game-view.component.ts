import { Component } from '@angular/core';
import { Observable } from 'rxjs/index';
import { CellModel } from '../../models/cell.model';
import { AppStateModel } from '../../models/app-state.model';
import { Store } from '@ngrx/store';
import { $myCells, $neutralCells, $theirCells } from '../../reducers/cell.reducer';
import { SendTransferAction } from '../../misc/actions';

@Component({
  selector: 'zo-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent {
  selectedCell: string | null = null;

  private readonly myCells$: Observable<CellModel[]>;
  private readonly theirCells$: Observable<CellModel[]>;
  private readonly neutralCells$: Observable<CellModel[]>;

  constructor(private readonly store: Store<AppStateModel>) {
    this.myCells$ = this.store.select($myCells);
    this.theirCells$ = this.store.select($theirCells);
    this.neutralCells$ = this.store.select($neutralCells);
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
