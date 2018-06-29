import { CellActions, CellUpdateAction } from '../misc/actions';
import { CellModel } from '../models/cell.model';
import { AppStateModel } from '../models/app-state.model';

export function cellReducer(state: CellModel[] = [], action: CellActions): CellModel[] {
  switch(action.type) {
    case CellUpdateAction.type:
      const updatedIds = action.payload.map(cell => cell.id);
      return [
        ...state.filter(cell => !updatedIds.includes(cell.id)),
        ...action.payload
      ];

    default:
      return state;
  }
}

export const $cells = ({cells}: AppStateModel) => cells;
