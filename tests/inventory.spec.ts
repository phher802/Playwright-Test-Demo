import { test, expect } from "@playwright/test";
import { login } from "../helpers/loginHelpers";
import {
  expectInventoryLoaded,
  getInventoryItemsNames,
  addFirstItemToCart,
  expectCartCount,
  removeItemFromCartInInventoryPage,
  addRandomItemToCart,
} from "../helpers/inventoryHelpers";

test("inventory shows products after login", async ({ page }) => {
  await login(page, "standard_user", "secret_sauce");
  await expectInventoryLoaded(page);

  const names = await getInventoryItemsNames(page);
  expect(names.length).toBeGreaterThan(0);
});

test("user can add an item to car", async ({ page }) => {
  await login(page, "standard_user", "secret_sauce");
  await expectInventoryLoaded(page);

  await addFirstItemToCart(page);
  await expectCartCount(page, 1);
});

test("user can remove item from cart", async ({ page }) => {
  await login(page, "standard_user", "secret_sauce");
  await expectInventoryLoaded(page);

  await addRandomItemToCart(page);
  await expectCartCount(page, 1);
  await removeItemFromCartInInventoryPage(page);
});
