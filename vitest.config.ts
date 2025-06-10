import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    css: true,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}']
    }
  }
});
