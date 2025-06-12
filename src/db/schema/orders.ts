import { relations } from 'drizzle-orm';
import {
  bigint,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { OrderStatus } from '../../types';
import { ordersProductsTable } from './ordersProducts';
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

export const ordersRelations = relations(ordersTable, ({ many }) => ({
  products: many(ordersProductsTable),
}));
