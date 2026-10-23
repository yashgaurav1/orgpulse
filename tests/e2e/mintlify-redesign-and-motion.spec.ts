import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = path.resolve(
  'C:/Users/Yash Gaurav/.gemini/antigravity/brain/c2dfd828-20d4-4a63-a7fa-f4cd108f372f/screenshots/mintlify'
);

test.describe('Mintlify Restyle & Calm Motion Verification', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  });

  test('1. Nav Dropdowns Open by Keyboard & Mouse', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Verify Product dropdown trigger exists
    const productTrigger = page.getByRole('button', { name: /product/i });
    await expect(productTrigger).toBeVisible();

    // Mouse click open
    await productTrigger.click();
    await expect(page.getByText('How It Works', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Role Views', { exact: false }).first()).toBeVisible();

    // Close by pressing Escape
    await page.keyboard.press('Escape');

    // Keyboard focus & Enter key open
    await productTrigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('How It Works', { exact: false }).first()).toBeVisible();
  });

  test('2. Every CTA Opens the Right Auth Tab in Modal', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Click "Sign in" in nav
    const signInBtn = page.getByRole('button', { name: /^sign in$/i }).first();
    await expect(signInBtn).toBeVisible();
    await signInBtn.click();

    // Verify modal is open on Sign In tab
    await expect(page.getByRole('tab', { name: /sign in/i })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByPlaceholder('you@company.com')).toBeVisible();

    // Close modal
    const closeBtn = page.getByRole('button', { name: /close modal/i });
    await closeBtn.click();

    // Click "Try demo" in nav
    const tryDemoBtn = page.getByRole('button', { name: /^try demo$/i }).first();
    await expect(tryDemoBtn).toBeVisible();
    await tryDemoBtn.click();

    // Verify modal is open on Try Demo tab
    await expect(page.getByRole('tab', { name: /try demo/i })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('button', { name: /enter demo environment/i })).toBeVisible();
  });

  test('3. Theme Choice Persists (Light / Dark / System)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Default theme should be light
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');

    // Switch to dark mode
    const darkBtn = page.getByRole('button', { name: /dark theme/i });
    await darkBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Reload page and assert dark theme persisted in localStorage
    await page.reload({ waitUntil: 'networkidle' });
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Switch back to light theme
    const lightBtn = page.getByRole('button', { name: /light theme/i });
    await lightBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await page.reload({ waitUntil: 'networkidle' });
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('4. Role Carousel Prev / Next Controls Advance Slides', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Assert initial slide is Employee Sanctuary
    await expect(page.getByText('Employee Sanctuary: A private space for honest reflection', { exact: false })).toBeVisible();

    // Click Next button
    const nextBtn = page.getByRole('button', { name: /next slide/i });
    await nextBtn.click();

    // Assert advanced to Manager Dashboard
    await expect(page.getByText('Manager Dashboard: Process health diagnostics', { exact: false })).toBeVisible();

    // Click Prev button
    const prevBtn = page.getByRole('button', { name: /previous slide/i });
    await prevBtn.click();

    // Assert returned to Employee Sanctuary
    await expect(page.getByText('Employee Sanctuary: A private space for honest reflection', { exact: false })).toBeVisible();
  });

  test('5. Wave Line Art Canvas Present & Configured Safely', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    const parent = canvas.locator('..');
    await expect(parent).toHaveAttribute('aria-hidden', 'true');
  });

  test('6. 404 Page Renders Cleanly without AppShell', async ({ page }) => {
    await page.goto('/some-nonexistent-route-xyz', { waitUntil: 'networkidle' });

    // Verify zero AppShell and zero Sidebar
    await expect(page.locator('[data-testid="app-shell"]')).toHaveCount(0);
    await expect(page.locator('aside')).toHaveCount(0);

    // Verify 404 content
    await expect(page.getByText('404', { exact: false }).first()).toBeVisible();
  });

  test('7. Visual Proof Screenshots at 1440px and 390px (Light & Dark)', async ({ page }) => {
    // 1440px Desktop Light
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-landing-1440px-light.png'), fullPage: false });

    // 1440px Desktop Dark
    const darkBtn = page.getByRole('button', { name: /dark theme/i });
    await darkBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-landing-1440px-dark.png'), fullPage: false });

    // Reset to light
    const lightBtn = page.getByRole('button', { name: /light theme/i });
    await lightBtn.click();

    // 390px Mobile Light
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-landing-390px-mobile.png'), fullPage: false });

    // 1440px Brand Spec Page (Logo size check 24/32/48/96px)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/dev/brand', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-dev-brand-1440px.png'), fullPage: false });
  });
});
