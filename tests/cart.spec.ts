import { test, expect } from "./fixtures";
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

test("cart shows added products after clicking cart icon", async ({
  loggedInPage,
  openCart,
}) => {
  await addFirstItemToCart(loggedInPage);
  const cartPage = await openCart();

  const names = await getCartInventoryItemsNames(cartPage);
  expect(names.length).toBeGreaterThan(0);
});

test("user can remove items from cart", async ({ loggedInPage, openCart }) => {
  const before = await currentCartCount(loggedInPage);

  if (before === 0) {
    await addFirstItemToCart(loggedInPage);
  }
  const current = await currentCartCount(loggedInPage);

  const cartPage = await openCart();
  await removeFirstCartItem(cartPage);
  const after = await currentCartCount(cartPage);

  if (before === 1 || current === 1) {
    expect(after).toBe(0);
  } else {
    expect(after).toBe(before - 1);
  }
});

test("empty cart shows no items", async ({ openCart }) => {
  const cartPage = await openCart();
  const names = await getCartInventoryItemsNames(cartPage);
  expect(names.length).toBe(0);
});

test("cart badge count matches number of added items", async ({
  loggedInPage,
  openCart,
}) => {
  await addFirstItemToCart(loggedInPage);
  await addRandomItemToCart(loggedInPage);
  await expectCartCount(loggedInPage, 2);
  const cartPage = await openCart();

  const names = await getCartInventoryItemsNames(cartPage);
  expect(names.length).toBe(2);
});
