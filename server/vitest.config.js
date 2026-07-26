/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Only real vitest specs. src/scripts/gateLogic.test.cjs is a standalone
    // shell script that calls process.exit() — vitest's default glob matched
    // *.test.cjs and crashed the worker picking it up.
    include: ['src/__tests__/**/*.test.js'],
  },
});
