import { AppStateModel } from '../models/app-state.model';
import { AppActions, InitializeAction } from '../misc/actions';
import { ActionReducer } from '@ngrx/store/src/models';

export function appReducer(reducer: ActionReducer<AppStateModel>): ActionReducer<AppStateModel> {
  return (state: AppStateModel, action: AppActions): AppStateModel => {
    switch (action.type) {
      case InitializeAction.type:
        return {
          ...state,
          cells: [],
          transfers: [],
          players: {me: null, them: null},
        };

      default:
        return reducer(state, action);
    }
  };
}
