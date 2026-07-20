import { test, expect } from '@playwright/test';

test.describe('Cart Flow', () => {
  test('can navigate to cart from navbar', async ({ page }) => {
    await page.goto('/');
    const cartLink = page.locator('a[href="/cart"]');
    await expect(cartLink).toBeVisible();
    await cartLink.click();
    await expect(page).toHaveURL(/\/cart/);
  });

  test('cart page loads', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Should show cart heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toContainText(/Cart|Keranjang|Beli/i);
  });
});

test.describe('Auth Flow', () => {
  test('login page loads with form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Login page uses placeholder "you@example.com" for email
    const emailInput = page.getByPlaceholder('you@example.com');
    const passwordInput = page.getByPlaceholder(/karakter/i);
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    // Has submit button
    await expect(page.getByRole('button', { name: /Masuk|Login|submit/i })).toBeVisible();
  });

  test('register page loads', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('profile page accessible (shows user info or login prompt)', async ({ page }) => {
    await page.goto('/profile');
    // Page renders something — either profile content or login prompt
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});

test.describe('Search Flow', () => {
  test('search input exists on homepage', async ({ page }) => {
    await page.goto('/');
    // Use role selector for search input
    const searchInput = page.getByRole('searchbox', { name: 'Cari produk' });
    await expect(searchInput).toBeVisible();
  });

  test('search input shows on all pages', async ({ page }) => {
    await page.goto('/login');
    const searchInput = page.getByRole('searchbox', { name: 'Cari produk' });
    await expect(searchInput).toBeVisible();
  });
});

test.describe('Checkout Flow', () => {
  test('checkout page loads', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});

test.describe('Admin Flow', () => {
  test('admin page loads', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});
