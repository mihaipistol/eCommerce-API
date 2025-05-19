import {
  bigint,
  double,
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { OrderStatus } from '../../types';
import { productsTable } from './products';
import { usersTable } from './users';

export const ordersTable = mysqlTable('orders', {
  id: serial().primaryKey(),
  userId: bigint({ mode: 'number', unsigned: true }).references(
    () => usersTable.id,
  ),
  status: varchar({ length: 50 }).notNull().default(OrderStatus.NEW),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
});

export const ordersItemsTable = mysqlTable('orders_items', {
  id: serial().primaryKey(),
  orderId: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => ordersTable.id),
  productId: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => productsTable.id),
  price: double().notNull(),
  quantity: int().notNull(),
});
