export enum MeStatus {
  LoggedOut = 'LoggedOut',
  LoggedIn = 'LoggedIn',
  Ready = 'Ready',
  Playing = 'Playing',
  Winner = 'Winner',
  Loser = 'Loser',
}

export interface MeModel {
  status: MeStatus;
  id: string | null;
  team: string | null;
  playingFrom?: number;
}
