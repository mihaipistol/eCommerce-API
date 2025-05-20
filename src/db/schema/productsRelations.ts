import { relations } from 'drizzle-orm';
import { ordersProductsTable } from './orders';
import { productsTable } from './products';

export const productsRelations = relations(productsTable, ({ many }) => ({
  orders: many(ordersProductsTable),
}));
