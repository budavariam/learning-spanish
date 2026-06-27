/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/src/**/*.test.ts'],
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: { strict: true } }] },
};
