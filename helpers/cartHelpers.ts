import { Page, expect } from "@playwright/test";

const CART_CONTAINER = "#cart_contents_container";
const CART_ITEM = ".cart_item";
const CART_INVENTORY_ITEM_NAME = ".inventory_item_name";
const CART_LINK = ".shopping_cart_link";
const CONTINUE_SHOPPING = "#continue-shopping";

export const goToCart = async (page: Page) => {
  await page.locator(CART_LINK).click();
  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator(CART_CONTAINER)).toBeVisible();
};

export const continueShopping = async (page: Page) => {
  await page.locator(CONTINUE_SHOPPING).click();
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator(".inventory_list")).toBeVisible();
};

export const expectCartLoaded = async (page: Page) => {
  await expect(page.locator(CART_CONTAINER)).toBeVisible();
};

export const getCartInventoryItemsNames = async (
  page: Page,
): Promise<string[]> => {
  const names = await page.locator(CART_INVENTORY_ITEM_NAME).allTextContents();
  return names.map((n) => n.trim()).filter(Boolean);
};

export const removeFirstCartItem = async (page: Page) => {
  const cartItems = page.locator(CART_ITEM);
  const before = await cartItems.count();
  if (before == 0) return;

  const firstItem = cartItems.first();
  const removeButton = firstItem.locator('button[data-test^="remove-"]');

  await expect(removeButton).toBeVisible();
  await removeButton.click();

  await expect(cartItems).toHaveCount(before - 1);
};

export const clearCart = async (page: Page) => {
  const cartItems = page.locator(CART_ITEM);

  while ((await cartItems.count()) > 0) {
    await removeFirstCartItem(page);
  }

  await expect(cartItems).toHaveCount(0);
};
