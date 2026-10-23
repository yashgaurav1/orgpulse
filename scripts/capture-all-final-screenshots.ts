import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = path.resolve('C:/Users/Yash Gaurav/.gemini/antigravity/brain/c2dfd828-20d4-4a63-a7fa-f4cd108f372f/screenshots/no-em-dash');

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // 1. Home Page
  console.log('1. Capturing Home Page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01-home-page-1440px.png') });

  // 2. Survey Notice Page
  console.log('2. Capturing Survey Notice...');
  await page.goto('http://localhost:3000/survey/demo-token', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02-survey-notice-1440px.png') });

  // 3. Survey Questions Page
  console.log('3. Capturing Survey Questions...');
  const startBtn = page.locator('button', { hasText: 'Take the Survey' });
  if (await startBtn.isVisible()) {
    await startBtn.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03-survey-questions-1440px.png') });

  // 4. Manager Dashboard
  console.log('4. Capturing Manager Dashboard...');
  await page.goto('http://localhost:3000/dashboard/manager', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04-manager-dashboard-1440px.png') });

  // 5. Director Dashboard - Table Element with Hidden / Suppressed Values
  console.log('5. Capturing Director Table Element...');
  await page.goto('http://localhost:3000/dashboard/director', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const tableContainer = page.locator('.overflow-x-auto').first();
  if (await tableContainer.isVisible()) {
    await tableContainer.screenshot({ path: path.join(OUTPUT_DIR, '05-director-table-hidden-values-1440px.png') });
  } else {
    const table = page.locator('table').first();
    await table.screenshot({ path: path.join(OUTPUT_DIR, '05-director-table-hidden-values-1440px.png') });
  }

  // 6. Director Dashboard - Scrolled View containing Table
  console.log('6. Capturing Director Dashboard Scrolled View...');
  const tableEl = page.locator('table').first();
  await tableEl.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06-director-dashboard-table-view-1440px.png') });

  await browser.close();
  console.log('Final screenshots captured successfully in:', OUTPUT_DIR);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
