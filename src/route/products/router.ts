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

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     description: Retrieve a list of all products available in the store.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', selectProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     description: Retrieve a single product by its unique ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         $ref: '#/components/responses/404'
 */
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
