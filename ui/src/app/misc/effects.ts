import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { UpdateEventModel } from '../models/update-event.model';
import { Observable, of } from 'rxjs/index';
import { switchMap, tap } from 'rxjs/internal/operators';
import { CellUpdateAction, PlayerUpdateAction, TransferUpdateAction } from './actions';
import * as io from 'socket.io-client';

const enum SocketEvent {
  Update = 'update',
  End = 'end',
}

const SOCKET_URL = 'http://localhost:8888';

@Injectable()
export class Effects {
  @Effect() update$ = this.observeEvent<UpdateEventModel>(SocketEvent.Update)
    .pipe(
      tap(event => console.log(SocketEvent.Update, event)),
      switchMap(({cells, transfers, players, me}) => of(
        new CellUpdateAction(cells),
        new TransferUpdateAction(transfers),
        new PlayerUpdateAction([players, me])
      ))
    );

  private socket = io(SOCKET_URL);

  private observeEvent<T>(eventType: SocketEvent): Observable<T> {
    return new Observable(subscriber => {
      this.socket.on(eventType, data => subscriber.next(data));
    });
  }
}
