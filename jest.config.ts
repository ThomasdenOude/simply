import type { Config } from 'jest';

const config: Config = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
	testPathIgnorePatterns: ['/node-modules/', '<rootDir>/src/test.ts'],
};

export default config;
