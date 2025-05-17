import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !process.env.DB_USERNAME ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_DATABASE
) {
  throw new Error('DB Values must be set in the environment variables');
}

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/db/schema/orders.ts',
    './src/db/schema/passwords.ts',
    './src/db/schema/products.ts',
    './src/db/schema/users.ts',
  ],
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  verbose: true,
  strict: true,
});
