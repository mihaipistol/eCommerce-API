import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { Router } from 'express';
import { z } from 'zod';
import { productsTable } from '../../db/schema/products';
import { validateToken } from '../../middleware/authorization';
import { validateData } from '../../middleware/validation';
import { UserRole } from '../../types';
import {
  deleteProduct,
  registerProduct,
  selectProductById,
  selectProducts,
  updateProduct,
} from './controller';

const registerSchema = createInsertSchema(productsTable)
  .extend({
    tags: z.string().array(),
  })
  .omit({
    id: true,
  });

const updateSchema = createUpdateSchema(productsTable);

const router = Router();

router.get('/', selectProducts);
router.get('/:id', selectProductById);
router.post(
  '/',
  // validateToken(UserRole.SELLER),
  validateData(registerSchema),
  registerProduct,
);
router.put(
  '/:id',
  validateToken(UserRole.SELLER),
  validateData(updateSchema),
  updateProduct,
);
router.delete('/:id', validateToken(UserRole.ADMIN), deleteProduct);

export default router;
