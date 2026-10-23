import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function main() {
  const outputDir = path.resolve(process.cwd(), 'docs/screenshots');
  const artifactDir = 'C:\\Users\\Yash Gaurav\\.gemini\\antigravity\\brain\\c2dfd828-20d4-4a63-a7fa-f4cd108f372f\\screenshots';

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const browser = await chromium.launch();

  const pages = [
    { name: '01-home', path: '/' },
    { name: '02-survey', path: '/survey/demo-token-payments' },
    { name: '03-manager-dashboard', path: '/dashboard/manager' },
    { name: '04-hr-view', path: '/dashboard/hr' },
    { name: '05-dev-components', path: '/dev/components' },
  ];

  const viewports = [
    { label: '1440px', width: 1440, height: 900 },
    { label: '360px', width: 360, height: 740 },
  ];

  const results: Record<string, { scrollWidth: number; innerWidth: number; hasOverflow: boolean }> = {};

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    for (const p of pages) {
      const url = `http://localhost:3000${p.path}`;
      console.log(`[CAPTURE] ${p.name} @ ${vp.label} (${url})...`);

      await page.goto(url, { waitUntil: 'domcontentloaded' });
      // Allow CSS fonts and layout animations to stabilize
      await page.waitForTimeout(1000);

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      const hasOverflow = scrollWidth > innerWidth;

      if (vp.label === '360px') {
        results[p.name] = { scrollWidth, innerWidth, hasOverflow };
        console.log(`[CHECK 360px] ${p.name}: scrollWidth=${scrollWidth}, innerWidth=${innerWidth}, overflow=${hasOverflow}`);

        if (hasOverflow) {
          const culprits = await page.evaluate(() => {
            const docWidth = window.innerWidth;
            return Array.from(document.querySelectorAll('*'))
              .filter((el) => {
                const rect = el.getBoundingClientRect();
                return rect.right > docWidth + 1;
              })
              .map((el) => `${el.tagName}.${el.className.split(' ').slice(0, 3).join('.')}`)
              .slice(0, 5);
          });
          console.warn(`[OVERFLOW CULPRITS in ${p.name}]:`, culprits);
        }
      }

      const fileName = `${p.name}-${vp.label}.png`;
      const localFilePath = path.join(outputDir, fileName);
      const artifactFilePath = path.join(artifactDir, fileName);

      await page.screenshot({ path: localFilePath, fullPage: false });
      fs.copyFileSync(localFilePath, artifactFilePath);

      console.log(`Saved screenshot: ${localFilePath}`);
    }

    await context.close();
  }

  await browser.close();
  console.log('[SUCCESS] All screenshots captured and copied to artifact directory.');
  console.log('[360px OVERFLOW SUMMARY]:', JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error('[ERROR] Capturing screenshots failed:', err);
  process.exit(1);
});
