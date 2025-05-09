import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
});

export const db = drizzle({ client: poolConnection });
