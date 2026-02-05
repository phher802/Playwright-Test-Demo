import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  //   testMatch: /.*\.spec\.ts/,
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
    baseURL: "https://www.saucedemo.com/",
    trace: "on-first-retry",
  },
  reporter: [["list"], ["html", { outputFolder: "playwright-report" }]],
});
