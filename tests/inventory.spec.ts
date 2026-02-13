import { test, expect } from "./fixtures";
import {
  getInventoryItemsNames,
  addFirstItemToCart,
  expectCartCount,
  removeItemFromCartInInventoryPage,
  addRandomItemToCart,
} from "../helpers/inventoryHelpers";

test("inventory shows products after login", async ({ loggedInPage }) => {
  const names = await getInventoryItemsNames(loggedInPage);
  expect(names.length).toBeGreaterThan(0);
});

test("user can add an item to cart", async ({ loggedInPage }) => {
  await addFirstItemToCart(loggedInPage);
  await expectCartCount(loggedInPage, 1);
});

test("user can remove item from cart", async ({ loggedInPage }) => {
  await addRandomItemToCart(loggedInPage);
  await expectCartCount(loggedInPage, 1);
  await removeItemFromCartInInventoryPage(loggedInPage);
  await expectCartCount(loggedInPage, 0);
});
