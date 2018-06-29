import { PlayerModel } from './player.model';

export interface PlayerMapModel {
  me: PlayerModel | null;
  them: PlayerModel | null;
}
