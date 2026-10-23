import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const ROUTES = [
  { name: '01-landing-home', path: '/' },
  { name: '02-employee-sanctuary', path: '/dashboard/employee' },
  { name: '03-companion-catalog', path: '/dashboard/companion' },
  { name: '04-manager-dashboard', path: '/dashboard/manager' },
  { name: '05-hr-operations', path: '/dashboard/hr' },
  { name: '06-director-scorecard', path: '/dashboard/director' },
  { name: '07-company-admin', path: '/dashboard/admin' },
  { name: '08-anonymous-survey', path: '/survey/demo-token-payments' },
  { name: '09-components-library', path: '/dev/components' },
];

async function capture() {
  const browser = await chromium.launch();
  const outDir = path.resolve(__dirname, '../../docs/screenshots/haven');
  fs.mkdirSync(outDir, { recursive: true });

  const artifactDir = 'C:/Users/Yash Gaurav/.gemini/antigravity/brain/c2dfd828-20d4-4a63-a7fa-f4cd108f372f/screenshots/haven';
  fs.mkdirSync(artifactDir, { recursive: true });

  console.log('Capturing Haven Enterprise Screenshots (1440px Desktop & 390px Mobile)...');

  // 1. Desktop Viewport (1440x900)
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const route of ROUTES) {
    try {
      await desktopPage.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle' });
      await desktopPage.waitForTimeout(500);

      const desktopFile = path.join(outDir, `${route.name}-1440px.png`);
      await desktopPage.screenshot({ path: desktopFile, fullPage: false });
      fs.copyFileSync(desktopFile, path.join(artifactDir, `${route.name}-1440px.png`));
      console.log(`✓ Captured Desktop 1440px: ${route.name}`);
    } catch (err: any) {
      console.error(`Error on desktop ${route.name}:`, err.message);
    }
  }

  // Also capture Light Theme desktop
  await desktopPage.goto('http://localhost:3000/dashboard/employee', { waitUntil: 'networkidle' });
  await desktopPage.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  });
  await desktopPage.waitForTimeout(400);
  const lightFile = path.join(outDir, '02-employee-sanctuary-light-1440px.png');
  await desktopPage.screenshot({ path: lightFile, fullPage: false });
  fs.copyFileSync(lightFile, path.join(artifactDir, '02-employee-sanctuary-light-1440px.png'));
  console.log(`✓ Captured Light Theme: 02-employee-sanctuary-light-1440px.png`);

  await desktopPage.close();

  // 2. Mobile Viewport (390x844 - iPhone 14 / modern standard)
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });

  for (const route of ROUTES) {
    try {
      await mobilePage.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle' });
      await mobilePage.waitForTimeout(500);

      // Verify zero horizontal overflow
      const overflow = await mobilePage.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (overflow) {
        console.warn(`⚠ Warning: Horizontal overflow detected on mobile ${route.name}`);
      } else {
        console.log(`✓ Audited Mobile 390px: ${route.name} (Zero Horizontal Overflow verified)`);
      }

      const mobileFile = path.join(outDir, `${route.name}-390px.png`);
      await mobilePage.screenshot({ path: mobileFile, fullPage: false });
      fs.copyFileSync(mobileFile, path.join(artifactDir, `${route.name}-390px.png`));
    } catch (err: any) {
      console.error(`Error on mobile ${route.name}:`, err.message);
    }
  }

  await mobilePage.close();
  await browser.close();
  console.log('Finished capturing all screenshots cleanly!');
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});
