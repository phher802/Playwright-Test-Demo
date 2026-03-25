import { Page, expect } from "@playwright/test";

const INVENTORY_CONTAINER = "#inventory_container";
const INVENTORY_ITEM = ".inventory_item";
const INVENTORY_ITEM_NAME = ".inventory_item_name";
const CART_BADGE = ".shopping_cart_badge";
const INVENTORY_LIST = ".inventory_list";

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

export const addItemToCartByTestId = async (page: Page, testId: string) => {
  const full = testId.startsWith("add-to-cart-")
    ? testId
    : `add-to-cart-${testId}`;
  const button = page.locator(`button[data-test="${full}"]`);

  if ((await button.count()) === 0) {
    throw new Error(`No add-to-cart button found with data-test="${full}"`);
  }
  await button.click();
};

export const addItemToCartByName = async (page: Page, name: string) => {
  const item = page.locator(INVENTORY_ITEM, {
    has: page.locator(INVENTORY_ITEM_NAME, { hasText: name }),
  });

  if ((await item.count()) === 0) {
    throw new Error(`No inventory item found with name "${name}`);
  }

  const addButton = item.locator('button[data-test^="add-to-cart-"]');
  if ((await addButton.count()) === 0) {
    throw new Error(
      `Item "${name}" has no add-to-cart button (maybe already added)`,
    );
  }

  await addButton.first().click();
};

export const addRandomItemToCart = async (page: Page) => {
  await page.waitForSelector(INVENTORY_LIST);
  const addButtons = page.locator('button[data-test^="add-to-cart-"]');
  const count = await addButtons.count();
  if (count === 0)
    throw new Error(
      "No add-to-cart buttons found found (maybe already added all items?)",
    );

  const randomIndex = Math.floor(Math.random() * count);
  const button = addButtons.nth(randomIndex);
  const dataTest = await button.getAttribute("data-test");
  console.log("Random add button:", dataTest);
  await button.click();
};

export const expectCartCount = async (page: Page, expectedCount: number) => {
  const badge = page.locator(CART_BADGE);

  if (expectedCount === 0) {
    await expect(badge).toHaveCount(0);
  } else {
    await expect(badge).toHaveText(String(expectedCount));
  }
};

export const currentCartCount = async (page: Page) => {
  const badge = page.locator(CART_BADGE);
  if ((await badge.count()) === 0) return 0;

  const text = (await badge.textContent())?.trim();
  return text ? Number(text) : 0;
};

export const removeItemFromCartInInventoryPage = async (page: Page) => {
  const firstAddedItem = page
    .locator(`${INVENTORY_ITEM}`)
    .getByRole("button", { name: "remove" });
  await firstAddedItem.click();
};
