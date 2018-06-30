import { CellActions, DeleteCellsAction, InitializeAction, UpsertCellsAction } from '../misc/actions';
import { CellModel } from '../models/cell.model';
import { AppStateModel } from '../models/app-state.model';
import { IdMap, removeByIds, toIdMap } from '../misc/utils';

export function cellReducer(state: IdMap<CellModel> = {}, action: CellActions): IdMap<CellModel> {
  switch(action.type) {
    case InitializeAction.type:
      return {};

    case UpsertCellsAction.type:
      return {...state, ...toIdMap((action as UpsertCellsAction).payload, 'id')};

    case DeleteCellsAction.type:
      return removeByIds(state, (action as DeleteCellsAction).payload);

    default:
      return state;
  }
}

export const $myCells = ({cells, me}: AppStateModel) => Object.values(cells)
  .filter(cell => cell.owner === me);

export const $theirCells = ({cells, me}: AppStateModel) => Object.values(cells)
  .filter(cell => cell.owner != null && cell.owner !== me);

export const $neutralCells = ({cells}: AppStateModel) => Object.values(cells)
  .filter(cell => cell.owner == null);

export const $cellsByIds = (...cellIds: string[]) => ({cells}: AppStateModel) => cellIds
  .map(id => cells[id] || null);
