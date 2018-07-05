import { Component } from '@angular/core';
import { AppStateModel } from '../../models/app-state.model';
import { Store } from '@ngrx/store';
import { EMPTY, interval, Observable } from 'rxjs/index';
import { $mePlayingFrom, $meStatus } from '../../reducers/me.reducer';
import { RequestLoginAction } from '../../misc/actions';
import { MeStatus } from '../../models/me.model';
import { map, startWith, switchMap } from 'rxjs/internal/operators';

@Component({
  selector: 'zo-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent {
  readonly MeStatus = MeStatus;
  readonly meStatus$: Observable<MeStatus>;
  readonly startIn$: Observable<number>;

  constructor(private readonly store: Store<AppStateModel>) {
    this.meStatus$ = this.store.select($meStatus);
    this.startIn$ = this.store.select($mePlayingFrom).pipe(
      switchMap(
        playingFrom => playingFrom !== null ?
          interval(1000).pipe(startWith(0), map(() => Math.max(Math.ceil((playingFrom - Date.now()) / 1000), 0))) :
          EMPTY
      )
    );
  }

  logIn(anonymous: boolean = false): void {
    this.store.dispatch(new RequestLoginAction({anonymous}))
  }
}
