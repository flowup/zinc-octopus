import { environment } from '../../environments/environment';
import { Action } from '@ngrx/store';
import { CellModel } from '../models/cell.model';
import { TransferModel } from '../models/transfer.model';
import { PlayerModel } from '../models/player.model';
import { TransferEventModel } from '../models/transfer-event.model';

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

export class InitializeAction extends LightAction { }
export class CellUpdateAction extends HeavyAction<CellModel[]> { }
export class TransferUpdateAction extends HeavyAction<TransferModel[]> { }
export class PlayerUpdateAction extends HeavyAction<[PlayerModel[], string]> { }
export class JoinAction extends HeavyAction<PlayerModel> { }
export class SendTransferAction extends HeavyAction<TransferEventModel> { }

export type AppActions = InitializeAction;
export type CellActions = CellUpdateAction;
export type TransferActions = TransferUpdateAction;
export type PlayerActions = PlayerUpdateAction;
