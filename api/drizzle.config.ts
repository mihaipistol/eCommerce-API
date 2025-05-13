import { defineConfig } from 'drizzle-kit';

if (
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !process.env.DB_USERNAME ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_DATABASE
) {
  console.error('DB Values must be set in the environment variables');
  throw new Error('DB Values must be set in the environment variables');
}

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/db/schema/passwords.ts',
    './src/db/schema/products.ts',
    './src/db/schema/users.ts',
  ],
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string, 10),
    user: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  },
  verbose: true,
  strict: true,
});
