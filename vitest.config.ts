import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: {
    // Node stays the default: the lib/** suites are pure logic and shouldn't pay for a
    // DOM. Component tests opt in per file with `// @vitest-environment jsdom`.
    environment: "node",
    include: ["lib/**/*.test.ts", "components/**/*.test.tsx"],
  },
});
