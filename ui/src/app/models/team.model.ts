import { PlayerModel } from './player.model';

export interface TeamModel {
  id: string;
  players: PlayerModel[];
}
