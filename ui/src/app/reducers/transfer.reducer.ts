import { TransferModel } from '../models/transfer.model';
import { TransferActions, TransferUpdateAction } from '../misc/actions';
import { AppStateModel } from '../models/app-state.model';

export function transferReducer(state: TransferModel[] = [], action: TransferActions): TransferModel[] {
  switch(action.type) {
    case TransferUpdateAction.type: {
      return action.payload;
    }

    default:
      return state;
  }
}

export const $transfers = ({transfers}: AppStateModel) => transfers;
