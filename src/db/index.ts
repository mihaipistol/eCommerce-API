import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import getEnvironment from './../lib/environment';
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

export default async function getDatabase() {
  const env = await getEnvironment();

  let connection = null;
  if (env.NODE_ENV === 'production') {
    connection = mysql.createPool({
      socketPath: env.INSTANCE_UNIX_SOCKET,
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
    });
  } else {
    console.log('Runinng in development mode');
    connection = mysql.createPool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
    });
  }

  return drizzle(connection, {
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
}
