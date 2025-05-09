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
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DATABASE_NAME || 'seed-full-stack-react-native',
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  },
  verbose: true,
  strict: true,
});
