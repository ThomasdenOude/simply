import { AuthenticationMessages } from '../models/authentication-messages';

/*
 *   Reference for Firebase errors:
 *
 *   https://firebase.google.com/docs/reference/js/auth#autherrorcodes
 */
export const authenticationErrorMap: Map<string, AuthenticationMessages> =
	new Map();

authenticationErrorMap.set(
	'auth/email-already-in-use',
	AuthenticationMessages.EmailExists
);
authenticationErrorMap.set(
	'auth/invalid-email',
	AuthenticationMessages.InvalidEmail
);
authenticationErrorMap.set(
	'auth/user-not-found',
	AuthenticationMessages.UserNotFound
);
authenticationErrorMap.set(
	'auth/user-disabled',
	AuthenticationMessages.UserDisabled
);
authenticationErrorMap.set(
	'auth/invalid-recipient-email',
	AuthenticationMessages.InvalidRecipientEmail
);
authenticationErrorMap.set(
	'auth/unverified-email',
	AuthenticationMessages.UnverifiedEmail
);
authenticationErrorMap.set(
	'auth/email-change-needs-verification',
	AuthenticationMessages.EmailChangeNeedsVerification
);
authenticationErrorMap.set(
	'auth/wrong-password',
	AuthenticationMessages.InvalidPassword
);
authenticationErrorMap.set(
	'auth/too-many-requests',
	AuthenticationMessages.TooManyAttempts
);
authenticationErrorMap.set(
	'auth/weak-password',
	AuthenticationMessages.WeakPassword
);
