// vitest.integration.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["__tests__/integration/**/*.test.js"],
    setupFiles: ["__tests__/integration/setup.js"],
    sequence: { concurrent: false },
  },
});
