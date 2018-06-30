import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { UpdateEventModel } from '../models/update-event.model';
import { Observable, of } from 'rxjs/index';
import { switchMap, tap } from 'rxjs/internal/operators';
import { CellUpdateAction, PlayerUpdateAction, SendTransferAction, TransferUpdateAction } from './actions';
import * as io from 'socket.io-client';
import { Actions } from '@ngrx/effects';

const enum SocketEvent {
  Update = 'update',
  Transfer = 'transfer',
  End = 'end',
}

const SOCKET_URL = 'http://172.16.27.115:8888';

@Injectable()
export class Effects {
  @Effect() update$ = this.observeEvent<UpdateEventModel>(SocketEvent.Update)
    .pipe(
      switchMap(({cells, transfers, players, me}) => of(
        new CellUpdateAction(cells),
        new TransferUpdateAction(transfers),
        new PlayerUpdateAction([players, me])
      ))
    );

  @Effect({dispatch: false}) sendTransfer$ = this.actions$
    .ofType(SendTransferAction.type)
    .pipe(
      switchMap(({payload}: SendTransferAction) => this.emitEvent(SocketEvent.Transfer, payload))
    );

  private socket = io(SOCKET_URL);

  constructor(private readonly actions$: Actions) { }

  private observeEvent<T>(eventType: SocketEvent): Observable<T> {
    return new Observable(subscriber => {
      this.socket.on(eventType, data => subscriber.next(data));
    });
  }

  private emitEvent<T>(eventType: SocketEvent, data: T): Observable<void> {
    return new Observable(subscriber => {
      this.socket.emit(eventType, data, () => subscriber.next());
    });
  }
}
