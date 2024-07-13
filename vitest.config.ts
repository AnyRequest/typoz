import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // ...
    exclude: [
      '**/node_modules/**',
      'src/(assets|common|pages)/**',
      './test/**',
      '**/dist/**',
      '**/cjs/**',
      '**/coverage/**',
      '**/examples/**',
    ],
    
    reporters: ['default', 'html', 'verbose'],
    coverage: {
      enabled: true,
      reporter: ['html'],
    },
    ui: true,
    benchmark: {
      reporters: 'verbose',
      outputFile: 'html',
    },
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    alias: [{ find: '@', replacement: path.join(path.resolve(), 'src') }],
  },
  server: {
    host: '0.0.0.0',
    port: 51204,
  },
});
