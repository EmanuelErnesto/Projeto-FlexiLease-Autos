// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
  packageManager: 'npm',
  reporters: ['clear-text', 'progress', 'html'],
  testRunner: 'vitest',
  testRunner_comment:
    'Take a look at https://stryker-mutator.io/docs/stryker-js/vitest-runner for information about the vitest plugin.',
  coverageAnalysis: 'perTest',
  mutate: [
    '**/*.ts',
    '!**/*spec.ts',
    '!**/*.js',
    '!**/*.dto.ts',
    '!**/*.routes.ts',
  ],
};
export default config;
