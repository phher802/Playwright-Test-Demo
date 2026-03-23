import {
  test as base,
  expect,
  type Page,
  type TestInfo,
} from "@playwright/test";
import { login } from "../helpers/loginHelpers";
import { expectInventoryLoaded } from "../helpers/inventoryHelpers";
import { expectCartLoaded, goToCart } from "../helpers/cartHelpers";

type Fixtures = {
  loggedInPage: Page;
  openCart: () => Promise<Page>; //lazy loading
};

//stash logs per-test in testInfo so afterEach can attach them
type LogState = { console: string[]; failedResponses: string[] };

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use, testInfo) => {
    // BEFORE  the test uses the page: start capturing logs
    const logs: LogState = { console: [], failedResponses: [] };
    (testInfo as any)._logs = logs;

    page.on("console", (msg) => {
      //keep it focused; can capture all types if desired
      if (msg.type() === "error" || msg.type() === "warning") {
        logs.console.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    page.on("response", (res) => {
      // track failing HTTP response (great for debugging)
      if (res.status() >= 400) {
        logs.failedResponses.push(`${res.status()} ${res.url()}`);
      }
    });

    await login(page, "standard_user", "secret_sauce");
    await expectInventoryLoaded(page);
    await use(page);

    // AFTER the test, attach logs only if the test failed
    if (testInfo.status !== testInfo.expectedStatus) {
      if (logs.console.length) {
        await testInfo.attach("console-errors-warnings", {
          body: logs.console.join("\n"),
          contentType: "text/plain",
        });
      }

      if (logs.failedResponses.length) {
        await testInfo.attach("http-4xx-5xx-responses", {
          body: logs.failedResponses.join("\n"),
          contentType: "text/plain",
        });
      }
    }
  },
  openCart: async ({ loggedInPage }, use) => {
    await use(async () => {
      await goToCart(loggedInPage);
      await expectCartLoaded(loggedInPage);
      return loggedInPage;
    });
  },
});

export { expect };
