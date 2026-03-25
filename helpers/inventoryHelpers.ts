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
  const button = page.locator('button[data-test^="add-to-cart-"]').first();
  await expect(button).toBeVisible();

  await button.click();
  //wait for state change
  await expect(button).toHaveAttribute("data-test", /remove-/);
};

export const addItemToCartByTestId = async (page: Page, testId: string) => {
  const full = testId.startsWith("add-to-cart-")
    ? testId
    : `add-to-cart-${testId}`;
  const button = page.locator(`button[data-test="${full}"]`);

  await expect(button).toHaveCount(1);
  await expect(button).toBeVisible();

  await button.click();
  await expect(button).toHaveAttribute("data-test", /remove-/);
};

export const addItemToCartByName = async (page: Page, name: string) => {
  const item = page.locator(INVENTORY_ITEM, {
    has: page.locator(INVENTORY_ITEM_NAME, { hasText: name }),
  });

  await expect(item).toHaveCount(1);

  const button = item.locator('button[data-test^="add-to-cart-"]').first();

  await button.click();
  await expect(button).toHaveAttribute("data-test", /remove-/);
};

export const addRandomItemToCart = async (page: Page) => {
  await page.waitForSelector(INVENTORY_LIST);
  const buttons = page.locator('button[data-test^="add-to-cart-"]');
  const count = await buttons.count();

  if (count === 0) throw new Error("No add-to-cart buttons found");

  const randomIndex = Math.floor(Math.random() * count);
  const button = buttons.nth(randomIndex);
  const dataTest = await button.getAttribute("data-test");
  console.log("Random add button:", dataTest);

  await button.click();
  await expect(button).toHaveAttribute("data-test", /remove-/);
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

export const removeFirstItemFromCartInInventoryPage = async (page: Page) => {
  const removeButton = page.locator('button[data-test^="remove-"]').first();

  await expect(removeButton).toHaveCount(1);

  await expect(removeButton).toBeVisible();
  await removeButton.click();

  await expect(removeButton).toHaveAttribute("data-test", /add-to-cart-/);
};
