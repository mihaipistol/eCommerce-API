import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { Router } from 'express';
import { productsTable } from '../../db/schema/products';
import { ROLE_ADMIN } from '../../lib/constants';
import { validateToken } from '../../middleware/authorization';
import { validateData } from '../../middleware/validation';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from './controller';

const createSchema = createInsertSchema(productsTable).omit({
  id: true,
});

const updateSchema = createUpdateSchema(productsTable);

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post(
  '/',
  validateToken(ROLE_ADMIN),
  validateData(createSchema),
  createProduct,
);
router.put(
  '/:id',
  validateToken(ROLE_ADMIN),
  validateData(updateSchema),
  updateProduct,
);
router.delete('/:id', validateToken(ROLE_ADMIN), deleteProduct);

export default router;
