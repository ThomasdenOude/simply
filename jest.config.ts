import type { Config } from 'jest';

const config: Config = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
	testPathIgnorePatterns: ['<rootDir>/node-modules/'],
	coveragePathIgnorePatterns: ['<rootDir>/src/test/'],
};

export default config;
