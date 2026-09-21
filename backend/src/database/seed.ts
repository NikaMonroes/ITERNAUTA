import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { categories } from './schema/index.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seed() {
  await db.insert(categories).values([
    { name: 'Manga' },
    { name: 'Cómic' },
  ]);

  console.log('Categorías iniciales creadas correctamente.');
}

seed()
  .catch((error) => {
    console.error('Error ejecutando el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });