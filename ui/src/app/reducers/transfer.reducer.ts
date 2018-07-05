import { TransferModel } from '../models/transfer.model';
import { AppStateModel } from '../models/app-state.model';
import { DeleteTransfersAction, InitializeAction, TransferActions, UpsertTransfersAction } from '../misc/actions';
import { IdMap, removeByIds, toIdMap } from '../misc/utils';
import { TransferOwner } from '../models/transfer-animation.model';

export function transferReducer(state: IdMap<TransferModel> = {}, action: TransferActions): IdMap<TransferModel> {
  switch(action.type) {
    case InitializeAction.type:
      return {};

    case UpsertTransfersAction.type:
      return {...state, ...toIdMap((action as UpsertTransfersAction).payload, 'id')};

    case DeleteTransfersAction.type:
      return removeByIds(state, (action as DeleteTransfersAction).payload);

    default:
      return state;
  }
}

export const $transferAnimations = ({transfers, cells, teams, me}: AppStateModel) => Object.values(transfers)
  .map(({id, from, to, start, end, owner, weight}) => ({
    transferId: id,
    fromX: cells[from].x,
    fromY: cells[from].y,
    toX: cells[to].x,
    toY: cells[to].y,
    startTime: start,
    endTime: end,
    owner: owner == null ? TransferOwner.None :
      owner === me.id ? TransferOwner.Me :
        teams[me.team].players.some(player => player.id === owner) ? TransferOwner.Friend :
          TransferOwner.Enemy,
    weight
  }));
