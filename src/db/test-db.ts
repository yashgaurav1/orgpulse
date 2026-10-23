import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

export async function createTestDatabase() {
  const db = new PGlite();
  
  // Read and apply migrations
  const migration1 = fs.readFileSync(
    path.resolve(__dirname, 'migrations/001_initial_schema.sql'),
    'utf-8'
  );
  const migration2 = fs.readFileSync(
    path.resolve(__dirname, 'migrations/002_retention.sql'),
    'utf-8'
  );

  await db.exec(migration1);
  await db.exec(migration2);
  return db;
}
