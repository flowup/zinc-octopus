import { environment } from '../../environments/environment';
import { Action } from '@ngrx/store';
import { CellModel } from '../models/cell.model';
import { TransferModel } from '../models/transfer.model';
import { PlayerModel } from '../models/player.model';
import { TransferEventModel } from '../models/transfer-event.model';
import { LoginOptionsModel } from '../models/login-options.model';
import { AuthInfoModel } from '../models/auth-info.model';

abstract class LightAction implements Action {
  private static cachedType: string;
  readonly type = (this.constructor as (Function & Action)).type;

  static get type(): string {
    if (this.cachedType == null) {
      this.cachedType = environment.production ?
        String(Math.random()) :
        this.name;
    }
    return this.cachedType;
  }
}

abstract class HeavyAction<T> extends LightAction {
  constructor(public readonly payload: T) {
    super();
  }
}

export class RequestLoginAction extends HeavyAction<LoginOptionsModel> { }
export class ConfirmLoginAction extends LightAction { }
export class RequestLogoutAction extends LightAction { }
export class ConfirmLogoutAction extends LightAction { }
export class InitializeAction extends HeavyAction<PlayerModel> { }
export class UpsertPlayersAction extends HeavyAction<PlayerModel[]> { }
export class DeletePlayersAction extends HeavyAction<string[]> { }
export class UpsertCellsAction extends HeavyAction<CellModel[]> { }
export class DeleteCellsAction extends HeavyAction<string[]> { }
export class UpsertTransfersAction extends HeavyAction<TransferModel[]> { }
export class DeleteTransfersAction extends HeavyAction<string[]> { }
export class RequestJoinAction extends HeavyAction<AuthInfoModel> { }
export class SendTransferAction extends HeavyAction<TransferEventModel> { }

export type PlayerActions = InitializeAction | UpsertPlayersAction | DeletePlayersAction;
export type CellActions = InitializeAction | UpsertCellsAction | DeleteCellsAction;
export type TransferActions = InitializeAction | UpsertTransfersAction | DeleteTransfersAction;
export type MeActions = ConfirmLoginAction | ConfirmLogoutAction | InitializeAction;
