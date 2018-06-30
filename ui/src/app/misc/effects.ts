import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { UpdateEventModel } from '../models/update-event.model';
import { Observable, of } from 'rxjs/index';
import { map, switchMap, tap } from 'rxjs/internal/operators';
import { CellUpdateAction, InitializeAction, JoinAction, PlayerUpdateAction, SendTransferAction, TransferUpdateAction } from './actions';
import * as io from 'socket.io-client';
import { Actions } from '@ngrx/effects';
import { environment } from '../../environments/environment';

const enum SocketEvent {
  // incoming
  Initialize = 'initialize',
  Update = 'update',
  End = 'end',

  //outgoing
  Join = 'join',
  Transfer = 'transfer',
}

@Injectable()
export class Effects {
  @Effect() initialize$ = this.observeEvent(SocketEvent.Initialize)
    .pipe(map(() => new InitializeAction()));

  @Effect() update$ = this.observeEvent<UpdateEventModel>(SocketEvent.Update)
    .pipe(
      switchMap(({cells, transfers, players, me}) => of(
        new CellUpdateAction(cells),
        new TransferUpdateAction(transfers),
        new PlayerUpdateAction([players, me])
      ))
    );

  @Effect({dispatch: false}) join$ = this.actions$
    .ofType(JoinAction.type)
    .pipe(
      switchMap(({payload}: JoinAction) => this.emitEvent(SocketEvent.Join, payload))
    );

  @Effect({dispatch: false}) sendTransfer$ = this.actions$
    .ofType(SendTransferAction.type)
    .pipe(
      switchMap(({payload}: SendTransferAction) => this.emitEvent(SocketEvent.Transfer, payload))
    );

  private socket = io(environment.socketUrl);

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
