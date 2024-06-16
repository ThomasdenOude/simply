import { Environment } from '../app/base/models/environment.model';

export const environment: Environment = {
	production: false,
  baseUrl: 'http://localhost:4200',
	firebaseConfig: {
    apiKey: "AIzaSyAzSAXZ827Fm-zmHgK8dJlABUDmQnX_43A",
    authDomain: "simply-task-board.firebaseapp.com",
    projectId: "simply-task-board",
    storageBucket: "simply-task-board.appspot.com",
    messagingSenderId: "675100270424",
    appId: "1:675100270424:web:fad3d139a79554093a8f2d"
  },
};
