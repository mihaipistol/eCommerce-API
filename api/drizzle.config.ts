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
    host: '34.40.17.37',
    port: 3306,
    user: 'root',
    password: 'Y,cy4/5-vfsecs^^Jm~~DOqGLR%E]ahR',
    database: 'ecommerce-demo',
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  },
  verbose: true,
  strict: true,
});
