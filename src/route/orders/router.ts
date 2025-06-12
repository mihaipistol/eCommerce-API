import { createInsertSchema } from 'drizzle-zod';
import { Router } from 'express';
import { ordersTable } from '../../db/schema/orders';
import { ordersProductsTable } from '../../db/schema/ordersProducts';
import { validateToken } from '../../middleware/authorization';
import { validateData } from '../../middleware/validation';
import { UserRole } from '../../types';
import {
  selectOrders,
  selectOrderById as getOrdersById,
  registerOrder,
} from './controller';

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

router.get('/', validateToken(UserRole.USER), selectOrders);
router.get('/:id', validateToken(UserRole.USER), getOrdersById);
router.post(
  '/',
  validateToken(UserRole.USER),
  validateData(registerSchema),
  registerOrder,
);
// router.delete('/:id');

export default router;
