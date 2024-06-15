
export type Environment = {
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
