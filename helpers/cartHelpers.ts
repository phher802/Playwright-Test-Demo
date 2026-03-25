import { Page, expect } from "@playwright/test";

const CART_CONTAINER = "#cart_contents_container";
const CART_ITEM = ".cart_item";
const CART_INVENTORY_ITEM_NAME = ".inventory_item_name";
const CART_LINK = ".shopping_cart_link";
const CONTINUE_SHOPPING = "#continue-shopping";

export const goToCart = async (page: Page) => {
  await page.click(CART_LINK);
};

export const continueShopping = async (page: Page) => {
  const button = page.locator(CONTINUE_SHOPPING);
  await expect(button).toBeVisible();
  await button.click();
};

export const expectCartLoaded = async (page: Page) => {
  await expect(page.locator(CART_CONTAINER)).toBeVisible();
};

export const getCartInventoryItemsNames = async (
  page: Page,
): Promise<string[]> => {
  const items = page.locator(CART_INVENTORY_ITEM_NAME);
  const count = await items.count();
  const names: string[] = [];

  for (let i = 0; i < count; i++) {
    names.push((await items.nth(i).textContent()) ?? "");
  }

  return names.filter(Boolean);
};

export const removeFirstCartItem = async (page: Page) => {
  const firstCartItem = page.locator(CART_ITEM).first();
  await expect(firstCartItem).toBeVisible();
  const removeButton = firstCartItem.locator('button[data-test^="remove-"]');
  await expect(removeButton).toBeVisible();
  await removeButton.click();
};

export const clearCart = async (page: Page) => {
  const cartItems = page.locator(CART_ITEM);

  while ((await cartItems.count()) > 0) {
    const before = await cartItems.count();
    await removeFirstCartItem(page);
    await expect(cartItems).toHaveCount(before - 1);
  }

  await expect(cartItems).toHaveCount(0);
};
