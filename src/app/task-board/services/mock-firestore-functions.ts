import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	updateDoc,
} from '@angular/fire/firestore';

const mockAddDoc: jest.MockedFn<typeof addDoc> = jest.mocked(addDoc, {
	shallow: true,
});
const mockCollection: jest.MockedFn<typeof collection> = jest.mocked(
	collection,
	{ shallow: true }
);
const mockDeleteDoc: jest.MockedFn<typeof deleteDoc> = jest.mocked(deleteDoc, {
	shallow: true,
});
const mockDoc: jest.MockedFn<typeof doc> = jest.mocked(doc, { shallow: true });
const mockGetDocs: jest.MockedFn<typeof getDocs> = jest.mocked(getDocs, {
	shallow: true,
});
const mockUpdateDoc: jest.MockedFn<typeof updateDoc> = jest.mocked(updateDoc, {
	shallow: true,
});

export {
	mockAddDoc,
	mockCollection,
	mockDeleteDoc,
	mockDoc,
	mockGetDocs,
	mockUpdateDoc,
};
