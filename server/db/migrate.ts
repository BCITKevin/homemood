import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrateClient = postgres(process.env.DATABASE_URL!, {max: 1});
await migrate(drizzle(migrateClient), {
    migrationsFolder: './drizzle',
});

console.log("migration complete");