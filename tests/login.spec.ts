import { test } from "@playwright/test";
import {
  gotoLogin,
  fillCredentials,
  submitLogin,
  login,
  expectLoginError,
} from "../helpers/loginHelpers";
import { expectInventoryLoaded } from "../helpers/inventoryHelpers";

test("successful login goes to inventory page", async ({ page }) => {
  await login(page, "standard_user", "secret_sauce");
  await expectInventoryLoaded(page);
});

test("invalid login shows an error message and stays on login page", async ({
  page,
}) => {
  await gotoLogin(page);
  await fillCredentials(page, "standard_user", "wrong_password");
  await submitLogin(page);

  await expectLoginError(
    page,
    "Epic sadface: Username and password do not match any user in this service",
  );
  await page.waitForURL("**/"); //saucedemo keeps you on the same page
});
