/*
 *   Reference for Firebase errors:
 *
 *   https://firebase.google.com/docs/reference/js/auth#autherrorcodes
 */
export enum AuthenticationErrors {
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
	Default = 'SOMETHING_WENT_WRONG',
}

export const authenticationErrorMap: Map<string, AuthenticationErrors> =
	new Map();

authenticationErrorMap.set(
	'auth/email-already-in-use',
	AuthenticationErrors.EmailExists
);
authenticationErrorMap.set(
	'auth/invalid-email',
	AuthenticationErrors.InvalidEmail
);
authenticationErrorMap.set(
	'auth/user-not-found',
	AuthenticationErrors.UserDeleted
);
authenticationErrorMap.set(
	'auth/user-disabled',
	AuthenticationErrors.UserDisabled
);
authenticationErrorMap.set(
	'auth/invalid-recipient-email',
	AuthenticationErrors.InvalidRecipientEmail
);
authenticationErrorMap.set(
	'auth/unverified-email',
	AuthenticationErrors.UnverifiedEmail
);
authenticationErrorMap.set(
	'auth/email-change-needs-verification',
	AuthenticationErrors.EmailChangeNeedsVerification
);
authenticationErrorMap.set(
	'auth/wrong-password',
	AuthenticationErrors.InvalidPassword
);
authenticationErrorMap.set(
	'auth/too-many-requests',
	AuthenticationErrors.TooManyAttempts
);
authenticationErrorMap.set(
	'auth/weak-password',
	AuthenticationErrors.WeakPassword
);
