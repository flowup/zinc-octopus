import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { UpdateEventModel } from '../models/update-event.model';
import { Observable, of } from 'rxjs/index';
import { switchMap, tap } from 'rxjs/internal/operators';
import { CellUpdateAction, TransferUpdateAction } from './actions';
import * as io from 'socket.io-client';

const enum SocketEvent {
  Initialize = 'initialize',
  Update = 'update',
  End = 'end',
}

const SOCKET_URL = 'http://172.16.27.115:8888';

@Injectable()
export class Effects {
  // @Effect() initialize$ = this.observeEvent(SocketEvent.Initialize)
  //   .pipe(
  //     tap(event => console.log(SocketEvent.Initialize, event)),
  //   );

  @Effect() update$ = this.observeEvent<UpdateEventModel>(SocketEvent.Update)
    .pipe(
      tap(event => console.log(SocketEvent.Update, event)),
      switchMap(({cells, transfers}) => of(
        new CellUpdateAction(cells),
        new TransferUpdateAction(transfers)
      ))
    );

  // @Effect() end$ = this.observeEvent(SocketEvent.End)
  //   .pipe(
  //     tap(event => console.log(SocketEvent.End, event)),
  //   );

  private socket;

  constructor() {
    this.socket = io(SOCKET_URL);
  }

  private observeEvent<T>(eventType: SocketEvent): Observable<T> {
    return new Observable(subscriber => {
      this.socket.on(eventType, data => subscriber.next(data));
    });
  }
}
