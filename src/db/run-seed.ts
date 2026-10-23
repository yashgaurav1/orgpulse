import { createTestDatabase } from './test-db';
import { seedDatabase } from './seed';

async function main() {
  // eslint-disable-next-line no-console
  console.log('[SEED] Initializing database and applying migrations...');
  const db = await createTestDatabase();

  // eslint-disable-next-line no-console
  console.log('[SEED] Populating sample data (5 squads, 2 cycles, 33 responses)...');
  const result = await seedDatabase(db);

  // eslint-disable-next-line no-console
  console.log(`[SEED] Success! Seeded:
  - Business Units: ${result.businessUnits}
  - Delivery Squads: ${result.squads}
  - Survey Cycles: ${result.cycles}
  - Anonymous Responses: ${result.responses}
  (All demo data tagged with "SAMPLE DATA")

===============================================================
📧 [DEV MODE: ACTIVE EMPLOYEE SURVEY LINKS]
Open any link in your browser to test the anonymous survey flow:
  • Squad A (FinTech):             http://localhost:3000/survey/demo-token-payments
  • Squad B (Retail):              http://localhost:3000/survey/demo-token-retail
  • Squad C (Cloud):               http://localhost:3000/survey/demo-token-cloud
  • Squad D (Legacy):              http://localhost:3000/survey/demo-token-legacy
  • Squad E (Platform Innovation): http://localhost:3000/survey/demo-token-innovation
===============================================================`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[SEED] Error:', err);
  process.exit(1);
});
