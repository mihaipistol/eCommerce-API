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
  brand: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  description: text(),
  price: double().notNull(),
  rating: double(),
  image: varchar({ length: 255 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const productsRelations = relations(productsTable, ({ many }) => ({
  orders: many(ordersProductsTable),
  tags: many(productsTagsTable),
}));
