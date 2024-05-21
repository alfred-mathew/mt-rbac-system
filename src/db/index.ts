import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { env } from '../config/env'

const pool = new Pool({
    connectionString: env.DB_CONN,
    ssl: true,
});

export const db = drizzle(pool);

export async function shutdownPool() {
    await pool.end();
}