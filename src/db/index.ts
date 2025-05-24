import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { addressesTable } from './schema/addresses';
import { ordersTable } from './schema/orders';
import { ordersRelations } from './schema/ordersRelations';
import { passwordsTable } from './schema/passwords';
import { passwordsRelations } from './schema/passwordsRelations';
import { productsTable } from './schema/products';
import { productsRelations } from './schema/productsRelations';
import { refreshTokensTable } from './schema/refreshTokens';
import { refreshTokensRelations } from './schema/refreshTokensRelations';
import { usersTable } from './schema/users';
import { usersRelations } from './schema/usersRelations';

let connection = null;
if (process.env.NODE_ENV === 'production') {
  if (
    !process.env.INSTANCE_UNIX_SOCKET ||
    !process.env.DB_PORT ||
    !process.env.DB_USERNAME ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_NAME
  ) {
    throw new Error('DB Values must be set in the environment variables');
  }
  connection = mysql.createPool({
    socketPath: process.env.INSTANCE_UNIX_SOCKET,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
  });
} else {
  console.log('Runinng in development mode');
  if (
    !process.env.DB_HOST ||
    !process.env.DB_PORT ||
    !process.env.DB_USERNAME ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_NAME
  ) {
    throw new Error('DB Values must be set in the environment variables');
  }
  connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
  });
}

export const db = drizzle(connection, {
  schema: {
    addresses: addressesTable,
    orders: ordersTable,
    passwords: passwordsTable,
    products: productsTable,
    refreshToken: refreshTokensTable,
    users: usersTable,
    ordersRelations,
    passwordsRelations,
    productsRelations,
    refreshTokensRelations,
    usersRelations,
  },
  mode: 'default',
});
