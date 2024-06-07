import { FirebaseError } from '@firebase/util';

export const mockError: FirebaseError = new FirebaseError(
	'mockErrorCode',
	'mockErrorMessage'
);
