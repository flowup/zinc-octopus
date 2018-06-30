import { TransferModel } from '../models/transfer.model';
import { AppStateModel } from '../models/app-state.model';
import { DeleteTransfersAction, InitializeAction, TransferActions, UpsertTransfersAction } from '../misc/actions';
import { IdMap, removeByIds, toIdMap } from '../misc/utils';

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

export const $transfers = ({transfers}: AppStateModel) => Object.values(transfers);
