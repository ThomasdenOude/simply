// Spy on firebase auth module functions
import {
	applyActionCode,
	authState,
	confirmPasswordReset,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	signInWithEmailAndPassword,
	signOut,
	updatePassword,
	verifyPasswordResetCode,
	deleteUser,
	sendPasswordResetEmail,
} from '@angular/fire/auth';

const mockAuthState: jest.MockedFn<typeof authState> = jest.mocked(authState, {
	shallow: true,
});
const mockCreateUser: jest.MockedFn<typeof createUserWithEmailAndPassword> =
	jest.mocked(createUserWithEmailAndPassword, { shallow: true });
const mockSignIn: jest.MockedFn<typeof signInWithEmailAndPassword> =
	jest.mocked(signInWithEmailAndPassword, { shallow: true });
const mockSignOut: jest.MockedFn<typeof signOut> = jest.mocked(signOut, {
	shallow: true,
});
const mockSendEmailVerification: jest.MockedFn<typeof sendEmailVerification> =
	jest.mocked(sendEmailVerification, { shallow: true });

const mockUpdatePassword: jest.MockedFn<typeof updatePassword> = jest.mocked(
	updatePassword,
	{ shallow: true }
);

const mockSendPasswordResetEmail: jest.MockedFn<typeof sendPasswordResetEmail> =
	jest.mocked(sendPasswordResetEmail, { shallow: true });

const mockConfirmPasswordReset: jest.MockedFn<typeof confirmPasswordReset> =
	jest.mocked(confirmPasswordReset, { shallow: true });

const mockVerifyPasswordResetCode: jest.MockedFn<
	typeof verifyPasswordResetCode
> = jest.mocked(verifyPasswordResetCode, { shallow: true });

const mockApplyActionCode: jest.MockedFn<typeof applyActionCode> = jest.mocked(
	applyActionCode,
	{ shallow: true }
);

const mockDeleteUser: jest.MockedFn<typeof deleteUser> = jest.mocked(
	deleteUser,
	{ shallow: true }
);

export {
	mockAuthState,
	mockCreateUser,
	mockSignIn,
	mockSignOut,
	mockSendEmailVerification,
	mockUpdatePassword,
	mockSendPasswordResetEmail,
	mockConfirmPasswordReset,
	mockVerifyPasswordResetCode,
	mockApplyActionCode,
	mockDeleteUser,
};
