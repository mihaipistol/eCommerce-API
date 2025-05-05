import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../../db/index';
import { productsTable } from '../../db/schema/products';

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const result = await db.select().from(productsTable);
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function getProductById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, productId));
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

export async function createProduct(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const [result] = await db
      .insert(productsTable)
      .values(req.body)
      .$returningId();
    console.log('Product created with ID:', result.id);
    res.status(201).json({
      id: result.id,
      ...req.body,
    });
  } catch (error) {
    console.error('Error inserting product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }
    const [result] = await db
      .update(productsTable)
      .set(req.body)
      .where(eq(productsTable.id, productId));
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }
    await db.delete(productsTable).where(eq(productsTable.id, productId));
    res.status(204);
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}
