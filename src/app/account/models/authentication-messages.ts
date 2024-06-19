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
	UserNotFound = 'USER_NOT_FOUND',
	UserDisabled = 'USER_DISABLED',
	EmailChangeNeedsVerification = 'EMAIL_CHANGE_NEEDS_VERIFICATION',
	InvalidPassword = 'INVALID_PASSWORD',
	TooManyAttempts = 'TOO_MANY_ATTEMPTS_TRY_LATER',
	WeakPassword = 'WEAK_PASSWORD',
	FailedDeleteUser = 'FAILED_DELETE_USER',
	Default = 'SOMETHING_WENT_WRONG',
	SuccessfulPasswordChange = 'SUCCESSFUL_PASSWORD_CHANGE',
  InvalidActionCode = 'INVALID_OOB_CODE',
  ExpiredActionCode = 'EXPIRED_OOB_CODE'
}
