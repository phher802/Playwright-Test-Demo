import { Page, expect } from "@playwright/test";

const USERNAME_INPUT = "#user-name";
const PASSWORD_INPUT = "#password";
const LOGIN_BUTTON = "#login-button";
const ERROR_BANNER = '[data-test="error"]';

export const gotoLogin = async (page: Page) => {
  await page.goto("https://www.saucedemo.com/");
};

export const fillCredentials = async (
  page: Page,
  username: string,
  password: string,
) => {
  await page.locator(USERNAME_INPUT).fill(username);
  await page.locator(PASSWORD_INPUT).fill(password);
};

export const submitLogin = async (page: Page) => {
  await page.locator(LOGIN_BUTTON).click();
};

export const login = async (page: Page, username: string, password: string) => {
  await gotoLogin(page);
  await fillCredentials(page, username, password);
  await submitLogin(page);
};

export const expectLoginError = async (
  page: Page,
  expectedSubstring?: string,
) => {
  const error = page.locator(ERROR_BANNER);
  await expect(error).toBeVisible();

  if (expectedSubstring) {
    await expect(error).toContainText(expectedSubstring);
  }
};
