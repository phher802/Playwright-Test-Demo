import { Page, expect } from "@playwright/test";

const CART_CONTAINER = "#cart_contents_container";
const CART_ITEM = ".cart_item";
const CART_INVENTORY_ITEM_NAME = ".inventory_item_name";
const CART_LINK = ".shopping_cart_link";

export const goToCart = async (page: Page) => {
  await page.click(CART_LINK);
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

  await firstCartItem.getByRole("button").click();
};
