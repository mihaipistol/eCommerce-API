import { createInsertSchema } from 'drizzle-zod';
import { Router } from 'express';
import { productsTable } from '../../db/schema/products';
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

const updateSchema = createSchema.partial();

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', validateData(createSchema), createProduct);
router.put('/:id', validateData(updateSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
