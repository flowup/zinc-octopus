import { CellActions, CellUpdateAction } from '../misc/actions';
import { CellModel } from '../models/cell.model';
import { AppStateModel } from '../models/app-state.model';

export function cellReducer(state: CellModel[] = [], action: CellActions): CellModel[] {
  switch(action.type) {
    case CellUpdateAction.type: {
      const updatedIds = action.payload.map(cell => cell.id);
      return [
        ...state.filter(cell => !updatedIds.includes(cell.id)),
        ...action.payload
      ];
    }

    default:
      return state;
  }
}

export const $myCells = ({cells, players}: AppStateModel) => cells
  .filter(cell => players.me != null && cell.owner === players.me.name);

export const $theirCells = ({cells, players}: AppStateModel) => cells
  .filter(cell => players.them != null && cell.owner === players.them.name);

export const $neutralCells = ({cells, players}: AppStateModel) => cells
  .filter(cell => cell.owner == null);

export const $cellsByIds = (...cellIds: string[]) => ({cells}: AppStateModel) => cellIds
  .map(id => cells.find(cell => cell.id === id) || null);
