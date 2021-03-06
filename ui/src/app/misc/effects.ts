import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable, of } from 'rxjs/index';
import { map, switchMap, tap } from 'rxjs/internal/operators';
import * as io from 'socket.io-client';
import { Actions } from '@ngrx/effects';
import { environment } from '../../environments/environment';
import { PlayerModel } from '../models/player.model';
import { CellModel } from '../models/cell.model';
import { TransferModel } from '../models/transfer.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import {
  DeleteCellsAction, DeleteTeamsAction, DeleteTransfersAction, InitializeAction, RequestLoginAction, SendTransferAction,
  UpsertCellsAction, UpsertTeamsAction, UpsertTransfersAction, ConfirmLoginAction, RequestJoinAction, RequestLogoutAction,
  ConfirmLogoutAction, EndAction, StartAction
} from './actions';
import { GameEndModel } from '../models/game-end.model';
import { TeamModel } from '../models/team.model';
import { GameScheduleModel } from '../models/game-schedule.model';

const enum SocketEvent {
  // incoming
  Initialize = 'initialize',
  Start = 'start',
  End = 'end',
  UpsertTeams = 'game.teams.upsert',
  DeleteTeams = 'game.teams.delete',
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
  @Effect() initialize$ = this.observeEvent<PlayerModel & GameScheduleModel>(SocketEvent.Initialize)
    .pipe(map(me => new InitializeAction(me)));

  @Effect() start$ = this.observeEvent<PlayerModel>(SocketEvent.Start)
    .pipe(map(() => new StartAction()));

  @Effect() end$ = this.observeEvent<GameEndModel>(SocketEvent.End)
    .pipe(map(gameEnd => new EndAction(gameEnd)));

  @Effect() upsertTeams$ = this.observeEvent<TeamModel[]>(SocketEvent.UpsertTeams)
    .pipe(map(teams => new UpsertTeamsAction(teams)));

  @Effect() deleteTeams$ = this.observeEvent<string[]>(SocketEvent.DeleteTeams)
    .pipe(map(teams => new DeleteTeamsAction(teams)));

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
