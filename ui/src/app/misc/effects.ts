import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/index';
import { map, switchMap } from 'rxjs/internal/operators';
import * as io from 'socket.io-client';
import { Actions } from '@ngrx/effects';
import { environment } from '../../environments/environment';
import { PlayerModel } from '../models/player.model';
import { CellModel } from '../models/cell.model';
import { TransferModel } from '../models/transfer.model';
import {
  DeleteCellsAction,
  DeletePlayersAction,
  DeleteTransfersAction,
  InitializeAction,
  JoinAction,
  SendTransferAction,
  UpsertCellsAction,
  UpsertPlayersAction,
  UpsertTransfersAction
} from './actions';
import { InitialInfoModel } from '../models/initial-info.model';

const enum SocketEvent {
  // incoming
  Initialize = 'initialize',
  End = 'end',
  UpsertPlayers = 'game.players.upsert',
  DeletePlayers = 'game.players.delete',
  UpsertCells = 'game.cells.upsert',
  DeleteCells = 'game.cells.delete',
  UpsertTransfers = 'game.transfers.upsert',
  DeleteTransfers = 'game.transfers.delete',

  //outgoing
  Join = 'join',
  Transfer = 'transfer',
}

@Injectable()
export class Effects {
  @Effect() initialize$ = this.observeEvent<InitialInfoModel>(SocketEvent.Initialize)
    .pipe(map(info => new InitializeAction(info)));

  @Effect() upsertPlayers$ = this.observeEvent<PlayerModel[]>(SocketEvent.UpsertPlayers)
    .pipe(map(players => new UpsertPlayersAction(players)));

  @Effect() deletePlayers$ = this.observeEvent<string[]>(SocketEvent.DeletePlayers)
    .pipe(map(players => new DeletePlayersAction(players)));

  @Effect() upsertCells$ = this.observeEvent<CellModel[]>(SocketEvent.UpsertCells)
    .pipe(map(cells => new UpsertCellsAction(cells)));

  @Effect() deleteCells$ = this.observeEvent<string[]>(SocketEvent.DeleteCells)
    .pipe(map(cells => new DeleteCellsAction(cells)));

  @Effect() upsertTransfers$ = this.observeEvent<TransferModel[]>(SocketEvent.UpsertTransfers)
    .pipe(map(transfers => new UpsertTransfersAction(transfers)));

  @Effect() deleteTransfers$ = this.observeEvent<string[]>(SocketEvent.DeleteTransfers)
    .pipe(map(transfers => new DeleteTransfersAction(transfers)));

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
