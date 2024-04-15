/*
 *   Reference for Firebase errors:
 *
 *   https://firebase.google.com/docs/reference/js/auth#autherrorcodes
 */
export enum AuthenticationMessages {
	None = 'NONE',
	EmailExists = 'EMAIL_EXISTS',
	InvalidEmail = 'INVALID_EMAIL',
	InvalidRecipientEmail = 'INVALID_RECIPIENT_EMAIL',
	UnverifiedEmail = 'UNVERIFIED_EMAIL',
	UserDeleted = 'USER_DELETED',
	UserDisabled = 'USER_DISABLED',
	EmailChangeNeedsVerification = 'EMAIL_CHANGE_NEEDS_VERIFICATION',
	InvalidPassword = 'INVALID_PASSWORD',
	TooManyAttempts = 'TOO_MANY_ATTEMPTS_TRY_LATER',
	WeakPassword = 'WEAK_PASSWORD',
	FailedDeleteUser = 'FAILED_DELETE_USER',
	Default = 'SOMETHING_WENT_WRONG',
}

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
	AuthenticationMessages.UserDeleted
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
