import {
  double,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { OrderStatus } from '../../types';
import { productsTable } from './products';
import { usersTable } from './users';

export const ordersTable = mysqlTable('orders', {
  id: int().primaryKey().autoincrement(),
  userId: int().references(() => usersTable.id),
  status: varchar({ length: 50 }).notNull().default(OrderStatus.NEW),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const ordersItemsTable = mysqlTable('orders_items', {
  id: int().primaryKey().autoincrement(),
  orderId: int().references(() => ordersTable.id),
  productId: int().references(() => productsTable.id),
  price: double().notNull(),
  quantity: int().notNull(),
});
