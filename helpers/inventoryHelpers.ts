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
  await page.locator(INVENTORY_LIST).waitFor();

  const addButton = page.locator('button[data-test^="add-to-cart-"]').first();
  await expect(addButton).toBeVisible();
  const addTestId = await addButton.getAttribute("data-test");
  if (!addTestId) throw new Error("Add button missing data-test attribute");
  console.log("URL before add:", page.url());

  const suffix = addTestId.replace("add-to-cart-", "");
  const removeTestId = `remove-${suffix}`;
  await addButton.click();
  //wait for the 'remove' version to exist
  await expect(
    page.locator(`button[data-test="${removeTestId}"]`),
  ).toBeVisible();
};

export const addItemToCartByTestId = async (page: Page, testId: string) => {
  const suffix = testId.replace(/^add-to-cart-/, "");
  const addToCartTestId = `add-to-cart-${suffix}`;
  const removeFromCartTestId = `remove-${suffix}`;

  const addButton = page.locator(`button[data-test="${addToCartTestId}"]`);
  await expect(addButton).toHaveCount(1);
  await expect(addButton).toBeVisible();

  await addButton.click();
  await expect(
    page.locator(`button[data-test="${removeFromCartTestId}"]`),
  ).toBeVisible();
};

export const addItemToCartByName = async (page: Page, name: string) => {
  const item = page.locator(INVENTORY_ITEM, {
    has: page.locator(INVENTORY_ITEM_NAME, { hasText: name }),
  });

  await expect(item).toHaveCount(1);

  const addButton = item.locator('button[data-test^="add-to-cart-"]').first();
  await expect(addButton).toBeVisible();

  const addTestId = await addButton.getAttribute("data-test");
  if (!addTestId)
    throw new Error(`Missing data-test for add button on item ${name}`);
  const suffix = addTestId.replace("add-to-cart-", "");
  const removeTestId = `remove-${suffix}`;

  await addButton.click();
  await expect(
    item.locator(`button[data-test="${removeTestId}"]`),
  ).toBeVisible();
};

export const addRandomItemToCart = async (page: Page) => {
  await page.locator(INVENTORY_LIST).waitFor();
  const buttons = page.locator('button[data-test^="add-to-cart-"]');
  const count = await buttons.count();

  if (count === 0) throw new Error("No add-to-cart buttons found");

  const randomIndex = Math.floor(Math.random() * count);
  const button = buttons.nth(randomIndex);
  const dataTestId = await button.getAttribute("data-test");
  if (!dataTestId) throw new Error("Random button data test not found.");
  console.log("Random add button:", dataTestId);

  const suffix = dataTestId.replace("add-to-cart-", "");
  const removeDataTestId = `remove-${suffix}`;

  await button.click();
  await expect(
    page.locator(`button[data-test="${removeDataTestId}"]`),
  ).toBeVisible();
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
  await page.locator(INVENTORY_LIST).waitFor();
  const removeButton = page.locator('button[data-test^="remove-"]').first();

  await expect(removeButton).toHaveCount(1);
  await expect(removeButton).toBeVisible();

  const removeTestId = await removeButton.getAttribute("data-test");
  if (!removeTestId)
    throw new Error("Remove button missing data-test attribute");

  const suffix = removeTestId.replace("remove-", "");
  const addTestId = `add-to-cart-${suffix}`;

  await removeButton.click();

  await expect(page.locator(`button[data-test="${addTestId}"]`)).toBeVisible();
};
