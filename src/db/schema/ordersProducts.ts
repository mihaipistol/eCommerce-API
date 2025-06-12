import {
  bigint,
  double,
  int,
  mysqlTable,
  primaryKey,
} from 'drizzle-orm/mysql-core';
import { ordersTable } from './orders';
import { productsTable } from './products';
import { relations } from 'drizzle-orm';

export const ordersProductsTable = mysqlTable(
  'orders_products',
  {
    orderId: bigint({ mode: 'number', unsigned: true })
      .notNull()
      .references(() => ordersTable.id),
    productId: bigint({ mode: 'number', unsigned: true })
      .notNull()
      .references(() => productsTable.id),
    price: double().notNull(),
    quantity: int().notNull(),
  },
  (t) => [primaryKey({ columns: [t.orderId, t.productId] })],
);

export const ordersProductsRelations = relations(
  ordersProductsTable,
  ({ one }) => ({
    order: one(ordersTable, {
      fields: [ordersProductsTable.orderId],
      references: [ordersTable.id],
    }),
    product: one(productsTable, {
      fields: [ordersProductsTable.productId],
      references: [productsTable.id],
    }),
  }),
);
