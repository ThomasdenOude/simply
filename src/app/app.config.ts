import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
	PreloadAllModules,
	provideRouter,
	withComponentInputBinding,
	withPreloading,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
	connectFirestoreEmulator,
	getFirestore,
	provideFirestore,
} from '@angular/fire/firestore';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';

import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { environment } from '../environments/environment';
import { APP_ROUTES } from './app.routes';
import { DEFAULT_DIALOG_CONFIG } from '@angular/cdk/dialog';
import { DialogComponent } from './base/ui/dialog/dialog.component';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(
			APP_ROUTES,
			withPreloading(PreloadAllModules),
			withComponentInputBinding()
		),
		provideAnimationsAsync(),
		importProvidersFrom(
			provideFirebaseApp(() => initializeApp(environment.firebaseConfig))
		),
		importProvidersFrom(
			provideFirestore(() => {
				const firestore = getFirestore();
				if (!environment.production) {
					connectFirestoreEmulator(firestore, 'localhost', 8080);
				}
				return firestore;
			})
		),
		importProvidersFrom(
			provideAuth(() => {
				const auth = getAuth();

				if (!environment.production) {
					connectAuthEmulator(auth, 'http://localhost:9099', {
						disableWarnings: true,
					});
				}
				return auth;
			})
		),
		{
			provide: DEFAULT_DIALOG_CONFIG,
			useValue: {
				disableClose: true,
				autoFocus: true,
				hasBackdrop: true,
				container: DialogComponent,
			},
		},
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: {
				appearance: 'outline',
				color: 'primary',
				hideRequiredMarker: true,
			},
		},
	],
};
