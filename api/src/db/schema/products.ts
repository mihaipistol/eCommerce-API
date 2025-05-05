import { desc } from 'drizzle-orm';
import {
  double,
  mysqlTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';

export const productsTable = mysqlTable('products', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image: varchar({ length: 255 }),
  price: double().notNull(),
});
