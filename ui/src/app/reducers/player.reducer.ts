import { PlayerActions, PlayerUpdateAction } from '../misc/actions';
import { PlayerMapModel } from '../models/player-map.model';
import { AppStateModel } from '../models/app-state.model';

const INITIAL_STATE = {
  me: null,
  them: null
};

export function playerReducer(state: PlayerMapModel = INITIAL_STATE, action: PlayerActions): PlayerMapModel {
  switch(action.type) {
    case PlayerUpdateAction.type: {
      const [players, me] = action.payload;
      return {
        me: players.find(player => player.name === me) || state.me,
        them: players.find(player => player.name !== me) || state.me,
      };
    }

    default:
      return state;
  }
}

export const $players = ({players}: AppStateModel) => players;
