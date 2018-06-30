import { Component } from '@angular/core';
import { AppStateModel } from '../../models/app-state.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/index';
import { $meKnown } from '../../reducers/me.reducer';
import { LoginAction } from '../../misc/actions';

@Component({
  selector: 'zo-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent {
  readonly meKnown$: Observable<boolean>;

  constructor(private readonly store: Store<AppStateModel>) {
    this.meKnown$ = this.store.select($meKnown);
  }

  logIn(anonymous: boolean = false): void {
    this.store.dispatch(new LoginAction({anonymous}))
  }
}
