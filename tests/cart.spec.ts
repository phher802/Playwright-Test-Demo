import { test, expect } from "@playwright/test";
import { login } from "../helpers/loginHelpers";
import {
  goToCart,
  expectCartLoaded,
  getCartInventoryItemsNames,
  removeFirstCartItem,
} from "../helpers/cartHelpers";
import {
  expectInventoryLoaded,
  addFirstItemToCart,
  currentCartCount,
  addRandomItemToCart,
  expectCartCount,
} from "../helpers/inventoryHelpers";

test("cart shows added products after clicking cart icon", async ({ page }) => {
  await login(page, "standard_user", "secret_sauce");
  await expectInventoryLoaded(page);
  await addFirstItemToCart(page);

  await goToCart(page);
  await expectCartLoaded(page);

  const names = await getCartInventoryItemsNames(page);
  expect(names.length).toBeGreaterThan(0);
});

test("user can remove items from cart", async ({ page }) => {
  await login(page, "standard_user", "secret_sauce");
  await expectInventoryLoaded(page);
  const before = await currentCartCount(page);

  if (before === 0) {
    await addFirstItemToCart(page);
  }
  const current = await currentCartCount(page);
  await goToCart(page);
  await expectCartLoaded(page);
  await removeFirstCartItem(page);
  const after = await currentCartCount(page);

  if (before === 1 || current === 1) {
    expect(after).toBe(0);
  } else {
    expect(after).toBe(before - 1);
  }
});

test("empty cart shows no items", async ({ page }) => {
  await login(page, "standard_user", "secret_sauce");
  await expectInventoryLoaded(page);

  await goToCart(page);
  await expectCartLoaded(page);

  const names = await getCartInventoryItemsNames(page);
  expect(names.length).toBe(0);
});

test("cart badge count matches number of added items", async ({ page }) => {
  await login(page, "standard_user", "secret_sauce");
  await expectInventoryLoaded(page);

  await addFirstItemToCart(page);
  await addRandomItemToCart(page);
  await expectCartCount(page, 2);

  await goToCart(page);
  await expectCartLoaded(page);
  const names = await getCartInventoryItemsNames(page);
  expect(names.length).toBe(2);
});
