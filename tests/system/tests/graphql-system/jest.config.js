/**
 * Jest Configuration for GraphQL System Tests
 * تكوين Jest لاختبارات نظام GraphQL
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: '../../',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],
  
  // Test match patterns
  testMatch: [
    '<rootDir>/**/*.test.ts',
    '<rootDir>/**/*.test.tsx'
  ],
  
  // Module name mapping
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../../src/$1',
    '^@/graphql-system/(.*)$': '<rootDir>/../../src/graphql-system/$1',
    '^@/components/(.*)$': '<rootDir>/../../src/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/../../src/hooks/$1',
    '^@/services/(.*)$': '<rootDir>/../../src/services/$1',
    '^@/types/(.*)$': '<rootDir>/../../src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/../../src/utils/$1',
    '^@/config/(.*)$': '<rootDir>/../../src/config/$1'
  },
  
  // Transform patterns
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    '../../src/graphql-system/**/*.{ts,tsx}',
    '../../src/hooks/use-*.{ts,tsx}',
    '../../src/services/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/dist/**'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/graphql-system/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],
  
  // Coverage directory
  coverageDirectory: '<rootDir>/../../reports/graphql-system/coverage',
  
  // Test timeout
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Global setup and teardown
  globalSetup: '<rootDir>/global-setup.ts',
  globalTeardown: '<rootDir>/global-teardown.ts',
  
  // Test results processor
  testResultsProcessor: '<rootDir>/test-results-processor.js',
  
  // Reporters
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: '<rootDir>/../../reports/graphql-system',
        filename: 'test-report.html',
        expand: true,
        hideIcon: false,
        pageTitle: 'GraphQL System Test Report - Coffee Selection'
      }
    ],
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/../../reports/graphql-system',
        outputName: 'junit.xml',
        suiteName: 'GraphQL System Tests',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true
      }
    ]
  ],
  
  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/../../src'],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/../../.next/',
    '<rootDir>/../../node_modules/',
    '<rootDir>/../../dist/',
    '<rootDir>/../../build/'
  ],
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
  // Max workers
  maxWorkers: '50%',
  
  // Cache directory
  cacheDirectory: '<rootDir>/../../.jest-cache',
  
  // Error on deprecated
  errorOnDeprecated: true,
  
  // Notify mode
  notify: false,
  
  // Bail on first failure in CI
  bail: process.env.CI ? 1 : 0,
  
  // Force exit
  forceExit: true,
  
  // Detect open handles
  detectOpenHandles: true,
  
  // Detect leaked timers
  detectLeaks: false,
  
  // Run tests in band for debugging
  runInBand: process.env.CI ? false : false,
  
  // Silent mode
  silent: false,
  
  // Test name pattern
  testNamePattern: process.env.TEST_NAME_PATTERN,
  
  // Test path pattern
  testPathPattern: process.env.TEST_PATH_PATTERN,
  
  // Update snapshots
  updateSnapshot: process.env.UPDATE_SNAPSHOTS === 'true',
  
  // Watch all files
  watchAll: false,
  
  // Globals
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/../../tsconfig.json'
    },
    __DEV__: true,
    __TEST__: true,
    __PROD__: false
  },
  
  // Environment variables
  setupFiles: ['<rootDir>/env-setup.ts']
};

// Create and export the Jest configuration
module.exports = createJestConfig(customJestConfig);