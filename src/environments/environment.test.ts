import { Environment } from '../app/base/models/environment.model';

export const environment: Environment = {
	production: true,
  baseUrl: 'https://test-simply-task-board.web.app',
	firebaseConfig: {
    apiKey: "AIzaSyAPhrtGaTIEU5jUF9mRtAN8ME8wpNB9kpY",
    authDomain: "test-simply-task-board.firebaseapp.com",
    projectId: "test-simply-task-board",
    storageBucket: "test-simply-task-board.appspot.com",
    messagingSenderId: "453318734816",
    appId: "1:453318734816:web:57dc0ffaa4891cbd163185"
  },
};
