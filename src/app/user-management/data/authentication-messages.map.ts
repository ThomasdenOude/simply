import { AuthenticationMessages } from '../models/authentication-messages';

/*
 *   Reference for Firebase errors:
 *
 *   https://firebase.google.com/docs/reference/js/auth#autherrorcodes
 */
export const authenticationErrorMap: Map<string, AuthenticationMessages> =
	new Map([
		['auth/email-already-in-use', AuthenticationMessages.EmailExists],
		['auth/invalid-email', AuthenticationMessages.InvalidEmail],
		['auth/user-not-found', AuthenticationMessages.UserNotFound],
		['auth/user-disabled', AuthenticationMessages.UserDisabled],
		[
			'auth/invalid-recipient-email',
			AuthenticationMessages.InvalidRecipientEmail,
		],
		['auth/unverified-email', AuthenticationMessages.UnverifiedEmail],
		[
			'auth/email-change-needs-verification',
			AuthenticationMessages.EmailChangeNeedsVerification,
		],
		['auth/wrong-password', AuthenticationMessages.InvalidPassword],
		['auth/too-many-requests', AuthenticationMessages.TooManyAttempts],
		['auth/weak-password', AuthenticationMessages.WeakPassword],
	]);
