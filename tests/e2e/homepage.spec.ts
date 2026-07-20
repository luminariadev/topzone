import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads with correct title and meta', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TopZone/);
    // Check meta description exists
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content', /TopZone/);
  });

  test('shows hero section with CTA', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore Games' })).toBeVisible();
  });

  test('navigates to games section via CTA', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Explore Games' }).click();
    await expect(page.locator('#games')).toBeVisible();
  });

  test('shows game cards on homepage', async ({ page }) => {
    await page.goto('/');
    const games = page.locator('#games a[href^="/games/"]');
    await expect(games.first()).toBeVisible({ timeout: 10000 });
    const count = await games.count();
    expect(count).toBeGreaterThan(0);
  });

  test('shows gear section on homepage', async ({ page }) => {
    await page.goto('/');
    const gear = page.locator('#gear a[href^="/gear/"]');
    await expect(gear.first()).toBeVisible({ timeout: 10000 });
    const count = await gear.count();
    expect(count).toBeGreaterThan(0);
  });

  test('navigation bar has all main links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Games', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Gear', exact: true })).toBeVisible();
  });

  test('footer has social links', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByText('©')).toBeVisible();
  });
});

test.describe('Game Detail', () => {
  test('navigates to game detail and shows info', async ({ page }) => {
    await page.goto('/');
    // Click first game
    const firstGame = page.locator('#games a[href^="/games/"]').first();
    await firstGame.waitFor({ state: 'visible', timeout: 10000 });
    const gameName = await firstGame.innerText();
    await firstGame.click();
    // Should be on game detail page
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Should have package cards
    const pkgCards = page.locator('[class*="package"], [class*="card"]');
    const pkgCount = await pkgCards.count();
    expect(pkgCount).toBeGreaterThan(0);
  });

  test('game detail has breadcrumb navigation', async ({ page }) => {
    await page.goto('/games/mobile-legends');
    await expect(page.locator('nav[aria-label="Breadcrumb"], .breadcrumb, [class*="breadcrumb"]')).toBeVisible();
  });
});

test.describe('Gear Detail', () => {
  test('navigates to gear detail and shows specs', async ({ page }) => {
    await page.goto('/');
    const firstGear = page.locator('#gear a[href^="/gear/"]').first();
    await firstGear.waitFor({ state: 'visible', timeout: 10000 });
    await firstGear.click();
    // Should be on gear detail page
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('gear detail has price info', async ({ page }) => {
    await page.goto('/gear');
    // Click first gear item
    const firstGear = page.locator('a[href^="/gear/"]').first();
    await firstGear.waitFor({ state: 'visible', timeout: 10000 });
    await firstGear.click();
    // Should show price (Rupiah or Rp)
    await expect(page.getByText(/Rp|IDR/i).first()).toBeVisible();
  });
});
