import { Component } from '@angular/core';
import { Observable } from 'rxjs/index';
import { CellModel } from '../../models/cell.model';
import { AppStateModel } from '../../models/app-state.model';
import { Store } from '@ngrx/store';
import { $myCells, $neutralCells, $theirCells } from '../../reducers/cell.reducer';

@Component({
  selector: 'zo-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent {
  private readonly myCells$: Observable<CellModel[]>;
  private readonly theirCells$: Observable<CellModel[]>;
  private readonly neutralCells$: Observable<CellModel[]>;

  constructor(private readonly store: Store<AppStateModel>) {
    this.myCells$ = this.store.select($myCells);
    this.theirCells$ = this.store.select($theirCells);
    this.neutralCells$ = this.store.select($neutralCells);
  }
}
