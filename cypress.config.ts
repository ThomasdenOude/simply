import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			config.baseUrl = 'https://test-simply-task-board.web.app/';

			return config;
		},
	},
});
