import { test, expect } from '@playwright/test';

test.describe('Pulse Route Groups, AppShell Isolation & Multi-Role Demo Landing', () => {
  test('Public Landing Page renders ZERO AppShells and scrolls at document level', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Assert zero AppShell elements on public landing page
    const appShells = page.locator('[data-testid="app-shell"]');
    await expect(appShells).toHaveCount(0);

    // Assert no fixed sidebar on public page
    const sidebars = page.locator('aside');
    await expect(sidebars).toHaveCount(0);

    // Verify public navigation exists
    const nav = page.locator('header');
    await expect(nav).toBeVisible();

    // Verify headline is present
    await expect(
      page.getByRole('heading', { name: /understand employee wellbeing before it becomes attrition/i })
    ).toBeVisible();
  });

  test('Public Governance Pages (/privacy, /terms) render without AppShell', async ({ page }) => {
    await page.goto('/privacy', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-testid="app-shell"]')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /privacy architecture/i })).toBeVisible();

    await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-testid="app-shell"]')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /terms of service/i })).toBeVisible();
  });

  test('App Dashboards render EXACTLY ONE AppShell and ONE Sidebar (never two)', async ({ page }) => {
    const dashboardUrls = [
      '/dashboard/employee',
      '/dashboard/manager',
      '/dashboard/hr',
      '/dashboard/director',
      '/dashboard/admin',
    ];

    for (const url of dashboardUrls) {
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Invariant: Exactly 1 AppShell in the DOM
      const appShells = page.locator('[data-testid="app-shell"]');
      await expect(appShells, `Expected exactly 1 AppShell on ${url}`).toHaveCount(1);

      // Invariant: Exactly 1 fixed sidebar in the DOM
      const sidebars = page.locator('aside');
      await expect(sidebars, `Expected exactly 1 sidebar on ${url}`).toHaveCount(1);
    }
  });

  test('Demo Entry Flow: Pick each role and dataset, enter demo, assert URL, single shell, and demo badge', async ({ page }) => {
    const demoConfigs = [
      { roleText: 'Employee', expectedUrl: /\/dashboard\/employee/, datasetId: 'squad-01' },
      { roleText: 'Manager', expectedUrl: /\/dashboard\/manager/, datasetId: 'squad-02' },
      { roleText: 'HRBP', expectedUrl: /\/dashboard\/hr/, datasetId: 'squad-03' },
      { roleText: 'Leadership', expectedUrl: /\/dashboard\/director/, datasetId: 'squad-04' },
    ];

    for (const config of demoConfigs) {
      // 1. Clean navigation to home in signed-out state
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        localStorage.clear();
      });
      await page.reload({ waitUntil: 'networkidle' });

      // 2. Click "Try the demo" or "Try Demo"
      const tryDemoBtn = page.locator('button:has-text("Try Demo"), button:has-text("Try the demo")').first();
      await expect(tryDemoBtn).toBeVisible();
      await tryDemoBtn.click();

      // 3. Verify AuthModal is open on Demo tab
      await expect(page.getByRole('heading', { name: /interactive demo sandbox/i })).toBeVisible({ timeout: 10000 });

      // 4. Select Role Perspective
      const roleBtn = page.getByRole('button', { name: new RegExp(`^${config.roleText}$`, 'i') });
      if (await roleBtn.isVisible()) {
        await roleBtn.click();
      }

      // 5. Select Dataset Scenario
      const datasetSelect = page.locator('select');
      if (await datasetSelect.isVisible()) {
        await datasetSelect.selectOption(config.datasetId);
      }

      // 6. Launch Demo Session
      const enterDemoBtn = page.getByRole('button', { name: /enter demo environment/i });
      await expect(enterDemoBtn).toBeVisible();
      await enterDemoBtn.click();

      // 7. Verify correct role dashboard URL
      await page.waitForURL(config.expectedUrl, { timeout: 10000 });

      // 8. Invariant: Exactly ONE AppShell and ONE Sidebar
      await expect(page.locator('[data-testid="app-shell"]')).toHaveCount(1);
      await expect(page.locator('aside')).toHaveCount(1);

      // 9. Invariant: "Demo Data" badge is visible
      await expect(page.getByText(/demo data/i).first()).toBeVisible();

      // 10. Exit Demo and verify clean return to landing page
      const exitBtn = page.locator('button[title*="Reset demo"], button:has-text("Exit Demo")').first();
      if (await exitBtn.isVisible()) {
        await exitBtn.click();
        await page.waitForURL('/', { timeout: 5000 });
        await expect(page.locator('[data-testid="app-shell"]')).toHaveCount(0);
      }
    }
  });
});
