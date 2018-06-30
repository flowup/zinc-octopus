import { DeletePlayersAction, InitializeAction, PlayerActions, UpsertPlayersAction } from '../misc/actions';
import { IdMap, removeByIds, toIdMap } from '../misc/utils';
import { PlayerModel } from '../models/player.model';

export function playerReducer(state: IdMap<PlayerModel> = {}, action: PlayerActions): IdMap<PlayerModel> {
  switch(action.type) {
    case InitializeAction.type:
      return {};

    case UpsertPlayersAction.type:
      return {...state, ...toIdMap((action as UpsertPlayersAction).payload, 'id')};

    case DeletePlayersAction.type:
      return removeByIds(state, (action as DeletePlayersAction).payload);

    default:
      return state;
  }
}
