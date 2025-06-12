import { relations } from 'drizzle-orm';
import {
  double,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { ordersProductsTable } from './ordersProducts';
import { productsTagsTable } from './productsTags';

export const productsTable = mysqlTable('products', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image: varchar({ length: 255 }),
  price: double().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const productsRelations = relations(productsTable, ({ many }) => ({
  orders: many(ordersProductsTable),
  tags: many(productsTagsTable),
}));
