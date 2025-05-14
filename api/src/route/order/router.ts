import { createInsertSchema } from 'drizzle-zod';
import { Router } from 'express';
import { ordersItemsTable, ordersTable } from '../../db/schema/orders';
import { validateData } from '../../middleware/validation';
import { createOrder as registerOrder } from './controller';
import { UserRole } from '../../types';
import { validateToken } from '../../middleware/authorization';

export const registerSchema = createInsertSchema(ordersTable)
  .extend({
    items: createInsertSchema(ordersItemsTable).array(),
  })
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  });

const router = Router();

// router.get('/:id');
router.post(
  '/',
  validateToken(UserRole.USER),
  validateData(registerSchema),
  registerOrder,
);
// router.delete('/:id');

export default router;
