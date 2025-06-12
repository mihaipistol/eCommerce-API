import { relations } from 'drizzle-orm';
import { mysqlTable, serial, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { productsTagsTable } from './productsTags';

export const tagsTable = mysqlTable('tags', {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }).unique().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const tagsRelations = relations(tagsTable, ({ many }) => ({
  products: many(productsTagsTable),
}));
