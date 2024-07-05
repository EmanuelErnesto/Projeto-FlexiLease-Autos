import dotenv from 'dotenv';
import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

dotenv.config({ path: '.env.test' });

export const userConfig = {
  plugins: [
    tsconfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    retry: 2,
    root: './',
    coverage: {
      provider: 'v8',
      exclude: [
        '**/*index.ts',
        '**/*server.ts',
        '**/*Table.ts',
        '**/*.dto.ts',
        '**/*.config.mjs',
      ],
      reporter: ['text', 'json', 'html'],
    },
    testTimeout: 20000,
  },
};

export default defineConfig(userConfig);
