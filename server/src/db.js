import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
export const pool = new pg.Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
});
export async function query(q, params = []) {
  const client = await pool.connect();
  try { return await client.query(q, params); }
  finally { client.release(); }
}