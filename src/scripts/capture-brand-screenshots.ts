import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const ARTIFACT_DIR = 'C:/Users/Yash Gaurav/.gemini/antigravity/brain/c2dfd828-20d4-4a63-a7fa-f4cd108f372f/screenshots/brand';
const DOCS_DIR = path.resolve(__dirname, '../../docs/screenshots/brand');

async function runBrandCapture() {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  fs.mkdirSync(DOCS_DIR, { recursive: true });

  const browser = await chromium.launch();
  console.log('🚀 Starting Pulse Brand & Route Groups Visual Inspection Capture...');

  // 1. Desktop Browser (1440x900)
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const save = async (name: string, page: any) => {
    const file1 = path.join(ARTIFACT_DIR, `${name}.png`);
    const file2 = path.join(DOCS_DIR, `${name}.png`);
    await page.screenshot({ path: file1, fullPage: false });
    fs.copyFileSync(file1, file2);
    console.log(`✓ Saved: ${name}.png`);
  };

  // 1. Landing Dark
  await desktop.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(600);
  await save('01-landing-dark-1440px', desktop);

  // 2. Landing Light
  await desktop.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  });
  await desktop.waitForTimeout(500);
  await save('01-landing-light-1440px', desktop);

  // Reset back to dark
  await desktop.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  });

  // 3. Auth Panel / Demo Modal
  await desktop.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(400);
  await desktop.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Try the demo') || b.textContent?.includes('Try Demo')
    );
    if (btn) (btn as HTMLElement).click();
  });
  await desktop.waitForTimeout(600);
  await save('02-auth-panel-modal-1440px', desktop);

  // Close modal with Escape
  await desktop.keyboard.press('Escape');
  await desktop.waitForTimeout(300);

  // 4. /dev/brand Spec Page (Dark)
  await desktop.goto('http://localhost:3000/dev/brand', { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(600);
  await save('03-brand-inspection-spec-dark-1440px', desktop);

  // 5. /dev/brand Spec Page (Light)
  await desktop.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  });
  await desktop.waitForTimeout(500);
  await save('03-brand-inspection-spec-light-1440px', desktop);

  // Reset to dark
  await desktop.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.remove('light');
  });

  // 6. Manager Dashboard (Squad 01 - Healthy)
  await desktop.goto('http://localhost:3000/dashboard/manager', { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(700);
  await save('04-manager-dashboard-1440px', desktop);

  // 7. Hidden Group Privacy Panel (Select Squad 03 with N=3 < 5)
  await desktop.selectOption('select', 'squad-03');
  await desktop.waitForTimeout(700);
  await save('09-hidden-group-privacy-lock-1440px', desktop);

  // 8. Director Scorecard
  await desktop.goto('http://localhost:3000/dashboard/director', { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(600);
  await save('05-director-scorecard-1440px', desktop);

  // 9. HRBP Operations
  await desktop.goto('http://localhost:3000/dashboard/hr', { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(600);
  await save('06-hrbp-operations-1440px', desktop);

  // 10. Employee Sanctuary
  await desktop.goto('http://localhost:3000/dashboard/employee', { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(600);
  await save('07-employee-sanctuary-1440px', desktop);

  // 11. Company Admin
  await desktop.goto('http://localhost:3000/dashboard/admin', { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(600);
  await save('08-company-admin-1440px', desktop);

  // 12. Components Library & Charts
  await desktop.goto('http://localhost:3000/dev/components', { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(600);
  await save('10-components-brand-blue-charts-1440px', desktop);

  await desktop.close();

  // 2. Mobile Browser (390x844 iPhone standard)
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });

  // Mobile Landing
  await mobile.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(600);
  await save('01-landing-mobile-390px', mobile);

  // Mobile Auth Modal
  await mobile.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Try the demo') || b.textContent?.includes('Try Demo')
    );
    if (btn) (btn as HTMLElement).click();
  });
  await mobile.waitForTimeout(500);
  await save('02-auth-panel-modal-mobile-390px', mobile);
  await mobile.keyboard.press('Escape');

  // Mobile /dev/brand
  await mobile.goto('http://localhost:3000/dev/brand', { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(600);
  await save('03-brand-inspection-spec-mobile-390px', mobile);

  // Mobile Manager Dashboard
  await mobile.goto('http://localhost:3000/dashboard/manager', { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(600);
  await save('04-manager-dashboard-mobile-390px', mobile);

  // Mobile Employee Sanctuary
  await mobile.goto('http://localhost:3000/dashboard/employee', { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(600);
  await save('07-employee-sanctuary-mobile-390px', mobile);

  // Mobile HRBP Operations
  await mobile.goto('http://localhost:3000/dashboard/hr', { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(600);
  await save('06-hrbp-operations-mobile-390px', mobile);

  // Mobile Director
  await mobile.goto('http://localhost:3000/dashboard/director', { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(600);
  await save('05-director-scorecard-mobile-390px', mobile);

  // Mobile Admin
  await mobile.goto('http://localhost:3000/dashboard/admin', { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(600);
  await save('08-company-admin-mobile-390px', mobile);

  await mobile.close();
  await browser.close();

  console.log('🎉 Successfully captured all brand rollout screenshots at 1440px and 390px!');
}

runBrandCapture().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
