import { Page, expect } from "@playwright/test";

const INVENTORY_CONTAINER = "#inventory_container";
const INVENTORY_ITEM = ".inventory_item";
const INVENTORY_ITEM_NAME = ".inventory_item_name";
const CART_BADGE = ".shopping_cart_badge";

export const expectInventoryLoaded = async (page: Page) => {
  await expect(page.locator(INVENTORY_CONTAINER).first()).toBeVisible();
};

export const getInventoryItemsNames = async (page: Page): Promise<string[]> => {
  const items = page.locator(INVENTORY_ITEM_NAME);
  const count = await items.count();
  const names: string[] = [];

  for (let i = 0; i < count; i++) {
    names.push((await items.nth(i).textContent()) ?? "");
  }

  return names.filter(Boolean);
};

export const addFirstItemToCart = async (page: Page) => {
  const firstAddButton = page.locator(`${INVENTORY_ITEM} button`).first();
  await firstAddButton.click();
};

export const expectCartCount = async (page: Page, expectedCount: number) => {
  const badge = page.locator(CART_BADGE);

  if (expectedCount === 0) {
    await expect(badge).toHaveCount(0);
  } else {
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText(String(expectedCount));
  }
};
