import { test as base, expect, type Page } from "@playwright/test";
import { gotoLogin, login } from "../helpers/loginHelpers";
import { expectInventoryLoaded } from "../helpers/inventoryHelpers";
import { expectCartLoaded, goToCart } from "../helpers/cartHelpers";

type Fixtures = {
  loggedInPage: Page;
  openCart: () => Promise<Page>; //lazy loading
};

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    await login(page, "standard_user", "secret_sauce");
    await expectInventoryLoaded(page);
    await use(page);
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
