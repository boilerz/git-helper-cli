const jestConfig = require('@boilerz/jest-config');

module.exports = {
  ...jestConfig,
  setupFiles: ['<rootDir>/.jest/setup.ts'],
  modulePathIgnorePatterns: [
    ...jestConfig.modulePathIgnorePatterns,
    '<rootDir>/src/__tests__/helper.ts',
  ],
  resetMocks: false,
};
