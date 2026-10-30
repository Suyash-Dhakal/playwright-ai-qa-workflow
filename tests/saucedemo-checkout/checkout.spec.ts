import { expect, test } from '@playwright/test';
import {
  addBackpackAndOpenCart,
  continueToOverview,
  fillCustomer,
  login,
  startCheckout,
  verifyOverviewTotals,
} from './helpers';

test.describe('SCRUM-101 SauceDemo checkout', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('completes checkout and resets the cart', async ({ page }) => {
    await page.locator('[data-test=add-to-cart-sauce-labs-backpack]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await page.locator('[data-test=shopping-cart-link]').click();

    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await startCheckout(page);
    await fillCustomer(page);
    await continueToOverview(page);

    await verifyOverviewTotals(page, 29.99);
    await expect(page.getByText('SauceCard #31337')).toBeVisible();
    await expect(page.getByText('Free Pony Express Delivery!')).toBeVisible();
    await page.locator('[data-test=finish]').click();

    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
    await expect(page.getByText('Your order has been dispatched')).toBeVisible();
    await page.getByRole('button', { name: 'Back Home' }).click();
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    await expect(page.locator('[data-test=add-to-cart-sauce-labs-backpack]')).toBeVisible();
  });

  test('shows required-field validation in order', async ({ page }) => {
    await addBackpackAndOpenCart(page);
    await startCheckout(page);

    await page.locator('[data-test=continue]').click();
    await expect(page.locator('[data-test=error]')).toHaveText('Error: First Name is required');

    await fillCustomer(page, 'John', '', '');
    await page.locator('[data-test=continue]').click();
    await expect(page.locator('[data-test=error]')).toHaveText('Error: Last Name is required');

    await fillCustomer(page, 'John', 'Doe', '');
    await page.locator('[data-test=continue]').click();
    await expect(page.locator('[data-test=error]')).toHaveText('Error: Postal Code is required');

    await fillCustomer(page, '', '', '12345');
    await page.locator('[data-test=continue]').click();
    await expect(page.locator('[data-test=error]')).toHaveText('Error: First Name is required');
  });

  test('cart navigation preserves items and supports Continue Shopping', async ({ page }) => {
    await page.locator('[data-test=add-to-cart-sauce-labs-backpack]').click();
    await page.locator('[data-test=shopping-cart-link]').click();

    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.cart_quantity')).toHaveText('1');
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('[data-test=remove-sauce-labs-backpack]')).toBeVisible();

    await page.locator('[data-test=shopping-cart-link]').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('cancels checkout from information and overview without completing', async ({ page }) => {
    await addBackpackAndOpenCart(page);
    await startCheckout(page);
    await fillCustomer(page);

    await page.locator('[data-test=cancel]').click();
    await expect(page).toHaveURL(/cart\.html$/);
    await expect(page.locator('.cart_item')).toHaveCount(1);

    await startCheckout(page);
    await fillCustomer(page);
    await continueToOverview(page);
    await page.locator('[data-test=cancel]').click();
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await expect(page.locator('[data-test=remove-sauce-labs-backpack]')).toBeVisible();
  });

  test('overview calculates the backpack subtotal and tax', async ({ page }) => {
    await addBackpackAndOpenCart(page);
    await startCheckout(page);
    await fillCustomer(page);
    await continueToOverview(page);

    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await verifyOverviewTotals(page, 29.99);
    await expect(page.locator('.summary_info')).toContainText('Payment Information');
    await expect(page.locator('.summary_info')).toContainText('Shipping Information');
  });

  test('checkout completion clears the cart and cannot recreate the order', async ({ page }) => {
    await addBackpackAndOpenCart(page);
    await startCheckout(page);
    await fillCustomer(page);
    await continueToOverview(page);
    await page.locator('[data-test=finish]').click();

    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
    await expect(page.getByText('Your order has been dispatched')).toBeVisible();
    await page.getByRole('button', { name: 'Back Home' }).click();
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    await expect(page.locator('[data-test=add-to-cart-sauce-labs-backpack]')).toBeVisible();
  });
});
