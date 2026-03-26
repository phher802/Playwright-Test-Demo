import { test, expect } from "./fixtures";
import {
  getInventoryItemsNames,
  addFirstItemToCart,
  expectCartCount,
  removeFirstItemFromCartInInventoryPage,
  addItemToCartByName,
} from "../helpers/inventoryHelpers";
import {
  continueShopping,
  getCartInventoryItemsNames,
  goToCart,
} from "../helpers/cartHelpers";

test("inventory shows products after login", async ({ loggedInPage }) => {
  const names = await getInventoryItemsNames(loggedInPage);
  expect(names.length).toBeGreaterThan(0);
});

test("user can add an item to cart", async ({ loggedInPage }) => {
  await addFirstItemToCart(loggedInPage);
  await expectCartCount(loggedInPage, 1);
});

test("user can remove item from cart from the inventory page", async ({
  loggedInPage,
}) => {
  await addItemToCartByName(loggedInPage, "Sauce Labs Fleece Jacket");

  //check the correct item was added
  await goToCart(loggedInPage);
  const itemNameInCart = await getCartInventoryItemsNames(loggedInPage);
  expect(itemNameInCart).toContain("Sauce Labs Fleece Jacket");
  await continueShopping(loggedInPage);

  await expectCartCount(loggedInPage, 1);
  await removeFirstItemFromCartInInventoryPage(loggedInPage);
  await expectCartCount(loggedInPage, 0);
});
