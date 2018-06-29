import { Component } from '@angular/core';
import { Observable } from 'rxjs/index';
import { CellModel } from '../../models/cell.model';
import { AppStateModel } from '../../models/app-state.model';
import { Store } from '@ngrx/store';
import { $cells } from '../../reducers/cell.reducer';

@Component({
  selector: 'zo-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent {
  private readonly cells$: Observable<CellModel[]>;

  constructor(private readonly store: Store<AppStateModel>) {
    this.cells$ = this.store.select($cells);
  }
}
