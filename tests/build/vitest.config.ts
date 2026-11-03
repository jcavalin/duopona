import { defineConfig } from 'vitest/config'

/** Build-output checks (`npm run test:pwa`); needs a fresh `npm run build`. */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/build/**/*.test.ts'],
    globals: true,
    passWithNoTests: true,
  },
})
