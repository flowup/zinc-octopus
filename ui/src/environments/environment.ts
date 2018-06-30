import { EnvironmentModel } from '../app/models/environment.model';

export const environment: EnvironmentModel = {
  production: false,
  socketUrl: 'https://172.16.27.115:8888',
  // socketUrl: 'https://35.198.81.84:8888',
  firebaseConfig: {
    apiKey: 'AIzaSyCzjCFF5ZvWHu97cb_dL7cdEfBB-Kkgq5s',
    authDomain: 'zinc-octopus.firebaseapp.com',
    projectId: 'zinc-octopus',
  }
};
