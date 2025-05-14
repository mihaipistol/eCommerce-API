import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../../db/index';
import { ordersTable } from '../../db/schema/orders';

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const { user, items, totalAmount } = req.body;
  } catch (error) {
    console.error('Error inserting order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}
