import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable, of } from 'rxjs/index';
import { map, switchMap, take, tap } from 'rxjs/internal/operators';
import * as io from 'socket.io-client';
import { Actions } from '@ngrx/effects';
import { environment } from '../../environments/environment';
import { PlayerModel } from '../models/player.model';
import { CellModel } from '../models/cell.model';
import { TransferModel } from '../models/transfer.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { Action } from '@ngrx/store';
import {
  DeleteCellsAction,
  DeletePlayersAction,
  DeleteTransfersAction,
  InitializeAction,
  RequestLoginAction,
  SendTransferAction,
  UpsertCellsAction,
  UpsertPlayersAction,
  UpsertTransfersAction,
  ConfirmLoginAction,
  RequestJoinAction, RequestLogoutAction, ConfirmLogoutAction,
} from './actions';

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
  @Effect() initialize$ = this.observeEvent<PlayerModel>(SocketEvent.Initialize)
    .pipe(map(me => new InitializeAction(me)));

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

  @Effect({dispatch: false}) requestLogIn$ = this.actions$
    .ofType(RequestLoginAction.type)
    .pipe(
      tap(({payload}: RequestLoginAction) => payload.anonymous ?
        this.afAuth.auth.signInAnonymously() :
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      )
    );

  @Effect({dispatch: false}) requestLogOut$ = this.actions$
    .ofType(RequestLogoutAction.type)
    .pipe(tap(() => this.afAuth.auth.signOut()));

  @Effect() observeToken$ = this.afAuth.idToken
    .pipe(
      switchMap(idToken => idToken != null ?
        of(new ConfirmLoginAction(), new RequestJoinAction({idToken})) :
        of(new ConfirmLogoutAction())
      )
    );

  @Effect({dispatch: false}) join$ = this.actions$
    .ofType(RequestJoinAction.type)
    .pipe(
      tap(({payload}: RequestJoinAction) => this.socket.emit(SocketEvent.Join, payload))
    );

  @Effect({dispatch: false}) sendTransfer$ = this.actions$
    .ofType(SendTransferAction.type)
    .pipe(
      tap(({payload}: SendTransferAction) => this.socket.emit(SocketEvent.Transfer, payload))
    );

  private socket = io(environment.socketUrl);

  constructor(private readonly actions$: Actions,
              private readonly afAuth: AngularFireAuth) { }

  private observeEvent<T>(eventType: SocketEvent): Observable<T> {
    return new Observable(subscriber => {
      this.socket.on(eventType, data => subscriber.next(data));
    });
  }
}
