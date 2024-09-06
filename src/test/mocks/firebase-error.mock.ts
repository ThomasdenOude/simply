import { FirebaseError } from '@firebase/util';

export const firebaseErrorMock: FirebaseError = new FirebaseError(
	'mockErrorCode',
	'mockErrorMessage'
);
