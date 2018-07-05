import { DeleteTeamsAction, InitializeAction, PlayerActions, UpsertTeamsAction } from '../misc/actions';
import { IdMap, removeByIds, toIdMap } from '../misc/utils';
import { PlayerModel } from '../models/player.model';
import { TeamModel } from '../models/team.model';

export function teamReducer(state: IdMap<TeamModel> = {}, action: PlayerActions): IdMap<TeamModel> {
  switch(action.type) {
    case InitializeAction.type:
      return {};

    case UpsertTeamsAction.type:
      return {...state, ...toIdMap((action as UpsertTeamsAction).payload, 'id')};

    case DeleteTeamsAction.type:
      return removeByIds(state, (action as DeleteTeamsAction).payload);

    default:
      return state;
  }
}
