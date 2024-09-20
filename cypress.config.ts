import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:4200/',
	},
	env: {
		environment: 'local',
		testUserOne: {
			email: 'hi@there.com',
			password: 'Opensesame',
		},
	},
});
