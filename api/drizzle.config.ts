import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/db/schema/passwords.ts',
    './src/db/schema/products.ts',
    './src/db/schema/users.ts',
  ],
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'ecommerce',
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  },
  verbose: true,
  strict: true,
});
