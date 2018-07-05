export enum MeStatus {
  LoggedOut,
  LoggedIn,
  Playing,
  Winner,
  Loser,
}

export interface MeModel {
  status: MeStatus;
  id: string | null;
}
