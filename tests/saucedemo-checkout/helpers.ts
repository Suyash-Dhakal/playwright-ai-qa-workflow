import { expect, Page } from '@playwright/test';

export const SAUCE_DEMO_URL = 'https://www.saucedemo.com';

export async function login(page: Page) {
  await page.goto(SAUCE_DEMO_URL);
  await page.locator('[data-test=username]').fill('standard_user');
  await page.locator('[data-test=password]').fill('secret_sauce');
  await page.locator('[data-test=login-button]').click();
  await expect(page).toHaveURL(/inventory\.html$/);
}

export async function addBackpackAndOpenCart(page: Page) {
  await login(page);
  await page.locator('[data-test=add-to-cart-sauce-labs-backpack]').click();
  await page.locator('[data-test=shopping-cart-link]').click();
  await expect(page).toHaveURL(/cart\.html$/);
}

export async function startCheckout(page: Page) {
  await page.locator('[data-test=checkout]').click();
  await expect(page).toHaveURL(/checkout-step-one\.html$/);
}

export async function fillCustomer(
  page: Page,
  firstName = 'John',
  lastName = 'Doe',
  postalCode = '12345',
) {
  await page.locator('[data-test=firstName]').fill(firstName);
  await page.locator('[data-test=lastName]').fill(lastName);
  await page.locator('[data-test=postalCode]').fill(postalCode);
}

export async function continueToOverview(page: Page) {
  await page.locator('[data-test=continue]').click();
  await expect(page).toHaveURL(/checkout-step-two\.html$/);
}

export async function verifyOverviewTotals(page: Page, expectedSubtotal: number) {
  const subtotals = await page.locator('.inventory_item_price').allTextContents();
  const calculatedSubtotal = subtotals.reduce((total, text) => {
    return total + Number.parseFloat(text.replace('$', ''));
  }, 0);

  const subtotal = Math.round(calculatedSubtotal * 100) / 100;
  expect(subtotal).toBe(expectedSubtotal);
  await expect(page.locator('.summary_subtotal_label')).toHaveText(`Item total: $${subtotal.toFixed(2)}`);

  const tax = Math.round(subtotal * 8) / 100;
  await expect(page.locator('.summary_tax_label')).toHaveText(`Tax: $${tax.toFixed(2)}`);
  await expect(page.locator('.summary_total_label')).toHaveText(`Total: $${(subtotal + tax).toFixed(2)}`);
}
