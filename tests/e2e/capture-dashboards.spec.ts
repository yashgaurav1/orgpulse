import { test } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.resolve(
  'C:/Users/Yash Gaurav/.gemini/antigravity/brain/c2dfd828-20d4-4a63-a7fa-f4cd108f372f/screenshots/mintlify'
);

test.describe('Capture Comprehensive Screenshots', () => {
  test('Capture Auth Modal and Dashboards', async ({ page }) => {
    // 1. Auth Modal on 1440px Desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const tryDemoBtn = page.getByRole('button', { name: /^try demo$/i }).first();
    await tryDemoBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-auth-modal-1440px.png') });

    // 2. Dashboards (Employee, Manager, HRBP, Leadership, Admin)
    const roles = [
      { url: '/dashboard/employee', name: '06-dashboard-employee-1440px.png' },
      { url: '/dashboard/manager', name: '07-dashboard-manager-1440px.png' },
      { url: '/dashboard/hr', name: '08-dashboard-hrbp-1440px.png' },
      { url: '/dashboard/director', name: '09-dashboard-leadership-1440px.png' },
      { url: '/dashboard/admin', name: '10-dashboard-admin-1440px.png' },
    ];

    for (const r of roles) {
      await page.goto(r.url, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, r.name) });
    }

    // 3. Mobile Dashboards on 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/dashboard/manager', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11-dashboard-manager-390px.png') });
  });
});
