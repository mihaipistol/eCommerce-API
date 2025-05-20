import { createInsertSchema } from 'drizzle-zod';
import { Router } from 'express';
import { ordersProductsTable, ordersTable } from '../../db/schema/orders';
import { validateData } from '../../middleware/validation';
import {
  getOrderById as getOrdersById,
  getOrders,
  registerOrder as registerOrder,
} from './controller';
import { UserRole } from '../../types';
import { validateToken } from '../../middleware/authorization';

export const registerSchema = createInsertSchema(ordersTable)
  .extend({
    items: createInsertSchema(ordersProductsTable)
      .omit({
        orderId: true,
        price: true,
      })
      .array(),
  })
  .omit({
    id: true,
    userId: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  });

const router = Router();

router.get('/', validateToken(UserRole.USER), getOrders);
router.get('/:id', validateToken(UserRole.USER), getOrdersById);
router.post(
  '/',
  validateToken(UserRole.USER),
  validateData(registerSchema),
  registerOrder,
);
// router.delete('/:id');

export default router;
