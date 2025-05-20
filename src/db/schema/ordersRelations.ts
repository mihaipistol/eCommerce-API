import { relations } from 'drizzle-orm';
import { ordersProductsTable, ordersTable } from './orders';
import { productsTable } from './products';

export const ordersRelations = relations(ordersTable, ({ many }) => ({
  products: many(ordersProductsTable),
}));

export const ordersItemsRelations = relations(
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
