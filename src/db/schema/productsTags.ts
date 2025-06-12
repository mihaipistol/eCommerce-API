import { bigint, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { productsTable } from './products';
import { relations } from 'drizzle-orm';

export const productsTagsTable = mysqlTable(
  'products_tags',
  {
    productId: bigint({ mode: 'number', unsigned: true })
      .notNull()
      .references(() => productsTable.id, { onDelete: 'cascade' }),
    tagId: bigint({ mode: 'number', unsigned: true })
      .notNull()
      .references(() => productsTable.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.productId, t.tagId] })],
);

export const productsTagsRelations = relations(
  productsTagsTable,
  ({ one }) => ({
    product: one(productsTable, {
      fields: [productsTagsTable.productId],
      references: [productsTable.id],
    }),
    tag: one(productsTable, {
      fields: [productsTagsTable.tagId],
      references: [productsTable.id],
    }),
  }),
);
