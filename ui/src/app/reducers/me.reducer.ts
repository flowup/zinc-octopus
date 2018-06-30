import { InitializeAction, MeActions } from '../misc/actions';
import { AppStateModel } from '../models/app-state.model';

export function meReducer(state: string | null, action: MeActions): string | null {
  switch (action.type) {
    case InitializeAction.type:
      return action.payload.me;

    default:
      return state;
  }
}

export const $me = ({me}: AppStateModel) => me;
