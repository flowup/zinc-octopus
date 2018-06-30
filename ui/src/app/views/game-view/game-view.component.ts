import { Component } from '@angular/core';
import { AppStateModel } from '../../models/app-state.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/index';
import { $meStatus } from '../../reducers/me.reducer';
import { RequestLoginAction } from '../../misc/actions';
import { MeStatus } from '../../models/me.model';

@Component({
  selector: 'zo-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent {
  readonly MeStatus = MeStatus;
  readonly meStatus$: Observable<MeStatus>;

  constructor(private readonly store: Store<AppStateModel>) {
    this.meStatus$ = this.store.select($meStatus);
  }

  logIn(anonymous: boolean = false): void {
    this.store.dispatch(new RequestLoginAction({anonymous}))
  }
}
