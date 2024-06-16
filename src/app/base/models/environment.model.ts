export type Environment = Readonly<BaseEnvironment>;

type BaseEnvironment = {
  production: boolean,
  baseUrl: string,
  firebaseConfig: {
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string
  }
}
