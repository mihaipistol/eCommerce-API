import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../../db';
import { productsTable } from '../../db/schema/products';

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const result = await db.select().from(productsTable);
    res.status(200).json(result);
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
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid product ID' });
      return;
    }
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

export async function registerProduct(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const [result] = await db
      .insert(productsTable)
      .values(req.body)
      .$returningId();
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
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid product ID' });
      return;
    }
    const [result] = await db
      .update(productsTable)
      .set(req.body)
      .where(eq(productsTable.id, id));
    res
      .status(result.affectedRows ? 200 : 404)
      .json(
        result.affectedRows
          ? { id: id, ...req.body }
          : { message: 'Product not found' },
      );
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
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid product ID' });
      return;
    }
    const [result] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id));
    res.status(result.affectedRows ? 204 : 404).json({
      message: result.affectedRows ? 'Product deleted' : 'Product not found',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}
