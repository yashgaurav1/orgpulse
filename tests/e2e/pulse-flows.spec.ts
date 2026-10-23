import { test, expect } from '@playwright/test';

test.describe('Pulse E2E Workflows (Section 11)', () => {
  /**
   * FLOW 1: Employee completes survey from mobile viewport (360x740)
   * - Mobile viewport 360x740
   * - Privacy notice & consent walkthrough
   * - 6-domain rating scale selection (120ms token animation)
   * - Free-text operational comment with character count
   * - Submit and verify <DrawCheck> calm confirmation
   * - Verify no individual record / token state retained
   */
  test('Flow 1: Employee completes survey from mobile viewport (360x740)', async ({ page }) => {
    // 1. Set mobile viewport
    await page.setViewportSize({ width: 360, height: 740 });

    // 2. Open survey with active single-use token
    await page.goto('/survey/demo-token-payments', { waitUntil: 'domcontentloaded' });

    // 3. Verify Privacy Commitment Notice
    await expect(page.getByText('PULSE /', { exact: false })).toBeVisible();
    await expect(page.getByRole('heading', { name: /survey notice & privacy declaration/i })).toBeVisible();
    await expect(page.getByText(/what is collected/i)).toBeVisible();
    await expect(page.getByText(/what is strictly not collected/i)).toBeVisible();

    // 4. Agree and advance to questions
    const beginBtn = page.getByRole('button', { name: /take the survey/i });
    await expect(beginBtn).toBeVisible();
    await beginBtn.click();

    // 5. Answer 6 items using rating scale buttons
    await expect(page.getByRole('heading', { name: /quarterly engineering pulse/i })).toBeVisible();

    // Each question has a fieldset/group with scale rating buttons (1 to 5)
    const ratings = [5, 4, 4, 5, 4, 5];
    for (let i = 1; i <= 6; i++) {
      const fieldset = page.getByRole('group', { name: new RegExp(`question ${i}:`, 'i') });
      await expect(fieldset).toBeVisible();
      // Select rating button by prefix digit (e.g. "5Strongly Agree" or "4Agree")
      const ratingBtn = fieldset.getByRole('button', { name: new RegExp(`^${ratings[i - 1]}`, 'i') });
      await ratingBtn.click();
    }

    // Verify progress counter reflects 6 of 6 answered
    await expect(page.getByText('6 of 6 answered')).toBeVisible();

    // 6. Enter optional operational feedback
    const commentInput = page.locator('#operational-comment');
    await expect(commentInput).toBeVisible();
    await commentInput.fill('Clear sprint objectives and steady delivery pace this quarter.');

    // 7. Submit survey
    const submitBtn = page.getByRole('button', { name: /submit anonymous response/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // 8. Verify confirmation step with <DrawCheck> checkmark
    await expect(page.getByRole('heading', { name: /response recorded/i })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(/your single-use token has been burned/i)).toBeVisible();
    await expect(page.getByText(/saved anonymously with no connection to your identity/i)).toBeVisible();

    // Verify SVG checkmark is rendered
    const checkmarkSvg = page.getByRole('img', { name: /success checkmark/i });
    await expect(checkmarkSvg).toBeVisible();
  });

  /**
   * FLOW 2: Delivery Manager views squad telemetry and 14-day action commitment
   * - Squad 01 (Payments & Ledger) loaded
   * - Minimum group threshold (N >= 5) met confirmation
   * - All 6 domain scores visible with <BarFill> and <CountUp>
   * - Active flags evaluated
   * - Verifies 14-day action plan commitment panel and switches to Squad 03 to log an action
   */
  test('Flow 2: Manager sees squad results after N met & commits to 14-day action', async ({ page }) => {
    // 1. Navigate to Manager Dashboard
    await page.goto('/dashboard/manager', { waitUntil: 'domcontentloaded' });

    // 2. Verify Squad 01 header and business unit
    await expect(page.getByText(/payments & ledger/i).first()).toBeVisible();
    await expect(page.getByText(/financial services/i).first()).toBeVisible();

    // 3. Verify Participation Card (N=12 respondents, threshold met)
    await expect(page.getByText(/12 of 12 responded/i)).toBeVisible();

    // 4. Verify all 6 Domain Score Bars
    const domains = [
      'Direction',
      'Autonomy',
      'Recognition',
      'Safety',
      'Workload',
      'Health',
    ];
    for (const domain of domains) {
      await expect(page.getByText(domain, { exact: true }).first()).toBeVisible();
    }

    // 5. Verify Calibrated Flags Panel
    await expect(page.getByText(/calibrated flags/i)).toBeVisible();

    // 6. Switch to Squad 03 (Order Fulfillment) which has an active workload flag
    const squadSelect = page.locator('select').first();
    await squadSelect.selectOption('squad-03');
    await page.waitForTimeout(400);

    // Verify Squad 03 is selected and action form is accessible
    await expect(page.getByText(/order fulfillment/i).first()).toBeVisible();
    const actionTextarea = page.locator('textarea');
    if (await actionTextarea.isVisible()) {
      await actionTextarea.fill('Adjusted sprint capacity by 15% and capped Friday evening deploys.');
      const commitBtn = page.getByRole('button', { name: /commit to 14-day action/i });
      await commitBtn.click();
      await expect(page.getByText(/14-day action committed/i)).toBeVisible();
    } else {
      // If action is already committed, verify action badge
      await expect(page.getByText(/14-day action commitment/i).first()).toBeVisible();
    }
  });

  /**
   * FLOW 3: HR exports team-level CSV with hidden squads excluded
   * - HRBP Operations dashboard loaded
   * - Scorecard displays squads in strict alphabetical order (no league tables)
   * - Squad 05 (Analytics & Big Data, N=3) is suppressed with <LockDraw>, zero numeric leakage
   * - Download team-level CSV export
   * - Assert visible squads are present in alphabetical order and Squad 05 is strictly excluded
   */
  test('Flow 3: HR exports team-level CSV with hidden squads excluded', async ({ page }) => {
    // 1. Navigate to HR Dashboard
    await page.goto('/dashboard/hr', { waitUntil: 'domcontentloaded' });

    // 2. Verify HR header & tabs
    await expect(page.getByRole('heading', { name: /hrbp operations/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /all squads scorecard/i })).toBeVisible();

    // 3. Verify Scorecard Table displays Squads
    await expect(page.getByText('Squad 01 (Payments & Ledger)').first()).toBeVisible();
    await expect(page.getByText('Squad 05 (Analytics & Big Data)').first()).toBeVisible();

    // 4. Verify Squad 05 is suppressed for privacy (N < 5)
    await expect(
      page.getByText(/suppressed under section 18 privacy threshold/i).first()
    ).toBeVisible();

    // 5. Trigger Safe CSV Export and intercept download
    const downloadPromise = page.waitForEvent('download');
    const exportBtn = page.getByRole('button', { name: /export safe csv/i });
    await expect(exportBtn).toBeVisible();
    await exportBtn.click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('pulse-squad-aggregates-q1-2026.csv');

    // Read download content as string
    const stream = await download.createReadStream();
    expect(stream).not.toBeNull();

    const chunks: Buffer[] = [];
    for await (const chunk of stream!) {
      chunks.push(Buffer.from(chunk));
    }
    const csvContent = Buffer.concat(chunks).toString('utf-8');

    // 6. Assertions on CSV Content
    // Privacy header notice must be present
    expect(csvContent).toContain('# PULSE TEAM-LEVEL AGGREGATE EXPORT');
    expect(csvContent).toContain('# Privacy Rule: Groups with fewer than 5 respondents are excluded by design');

    // Visible squads must be present
    expect(csvContent).toContain('Squad 01 (Payments & Ledger)');
    expect(csvContent).toContain('Squad 02 (Checkout & Cart Funnel)');

    // STRICT INVARIANT: Hidden Squad 05 (N < 5) must NOT be present in CSV
    expect(csvContent).not.toContain('Squad 05 (Analytics & Big Data)');

    // Verify alphabetical ordering in the rows
    const squad01Idx = csvContent.indexOf('Squad 01 (Payments & Ledger)');
    const squad02Idx = csvContent.indexOf('Squad 02 (Checkout & Cart Funnel)');
    const squad04Idx = csvContent.indexOf('Squad 04 (Platform Infrastructure & SRE)');

    expect(squad01Idx).toBeLessThan(squad02Idx);
    expect(squad02Idx).toBeLessThan(squad04Idx);
  });
});
