import { double, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

export const productsTable = mysqlTable('products', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image: varchar({ length: 255 }),
  price: double().notNull(),
});
