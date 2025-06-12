import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import getEnvironment from './../lib/environment';
import { addressesTable } from './schema/addresses';
import { ordersRelations, ordersTable } from './schema/orders';
import { passwordsRelations, passwordsTable } from './schema/passwords';
import { productsRelations, productsTable } from './schema/products';
import {
  refreshTokensRelations,
  refreshTokensTable,
} from './schema/refreshTokens';
import { usersRelations, usersTable } from './schema/users';
import {
  ordersProductsRelations,
  ordersProductsTable,
} from './schema/ordersProducts';
import {
  productsTagsRelations,
  productsTagsTable,
} from './schema/productsTags';
import { tagsRelations, tagsTable } from './schema/tags';

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
      ordersRelations,
      ordersProducts: ordersProductsTable,
      ordersProductsRelations,
      passwords: passwordsTable,
      passwordsRelations,
      products: productsTable,
      productsRelations,
      refreshToken: refreshTokensTable,
      refreshTokensRelations,
      productsTags: productsTagsTable,
      productsTagsRelations,
      tags: tagsTable,
      tagsRelations,
      users: usersTable,
      usersRelations,
    },
    mode: 'default',
  });
}
