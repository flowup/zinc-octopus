export enum MeStatus {
  LoggedOut,
  LoggedIn,
  Playing
}

export interface MeModel {
  status: MeStatus;
  id: string | null;
}
