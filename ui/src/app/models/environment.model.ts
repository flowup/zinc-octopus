export interface EnvironmentModel {
  production: boolean;
  socketUrl: string;
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
  };
}
