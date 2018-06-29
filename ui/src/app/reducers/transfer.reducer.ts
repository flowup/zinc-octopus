import { TransferModel } from '../models/transfer.model';
import { TransferActions, TransferUpdateAction } from '../misc/actions';

export function transferReducer(state: TransferModel[] = [], action: TransferActions): TransferModel[] {
  switch(action.type) {
    case TransferUpdateAction.type: {
      const updatedIds = action.payload.map(transfer => transfer.id);
      return [
        ...state.filter(transfer => !updatedIds.includes(transfer.id)),
        ...action.payload
      ];
    }

    default:
      return state;
  }
}
