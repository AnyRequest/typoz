/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['<rootDir>/'],
  rootDir: '.',
  testEnvironment: 'node',
  // testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    html: `<html lang="ko">
    <head></head>
    <body>
    </body>
    </html>`,
  },
  // testRegex: '.e2e-spec.ts$',
  testMatch: [
    '<rootDir>/**/*.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/(tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))',
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  // testTimeout: 10000,
  detectOpenHandles: true,
  forceExit: true,
};

module.exports = config;
