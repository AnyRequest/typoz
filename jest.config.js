/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['<rootDir>/'],
  rootDir: '.',
  testEnvironment: 'node',
  // testRegex: '.e2e-spec.ts$',
  testMatch: [
    '<rootDir>/**/*.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/(tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))',
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  // testTimeout: 10000,
  detectOpenHandles: true,
  forceExit: true,
};

module.exports = config;
