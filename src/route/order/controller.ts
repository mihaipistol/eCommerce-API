import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../../db';
import { ordersItemsTable, ordersTable } from '../../db/schema/orders';
import { productsTable } from '../../db/schema/products';

export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.id === undefined) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }
    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userId, req.user?.id))
      .leftJoin(ordersItemsTable, eq(ordersItemsTable.orderId, ordersTable.id));
    if (!orders) {
      res.status(404).json({ message: 'Orders not found' });
      return;
    }
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
export async function getOrdersByUserId(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (req.user?.id === undefined) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }
    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userId, req.user?.id))
      .leftJoin(ordersItemsTable, eq(ordersItemsTable.orderId, ordersTable.id));
    if (!orders) {
      res.status(404).json({ message: 'Orders not found' });
      return;
    }
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders by user ID:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid order ID' });
      return;
    }
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .leftJoin(ordersItemsTable, eq(ordersItemsTable.orderId, ordersTable.id));
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json({ ...order.orders, items: order.orders_items });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

export async function registerOrder(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const [order] = await db
      .insert(ordersTable)
      .values({
        userId: req.user?.id,
        ...req.body,
      })
      .$returningId();
    if (!order) {
      res.status(404).json({ message: 'Failed to inser order' });
      return;
    }
    req.body.items.map(async (item: any) => {
      item.orderId = order.id;
      const [product] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, item.productId));
      if (product) {
        item.price = product.price;
      }
    });
    for (const item of req.body.items) {
      item.orderId = order.id;
      const [product] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, item.productId));
      if (product) {
        item.price = product.price;
      }
    }
    // const items = await db
    //   .insert(ordersItemsTable)
    //   .values(req.body.items)
    //   .$returningId();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error inserting order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}

export async function deleteOrder(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid order ID' });
      return;
    }
    const [result] = await db.delete(ordersTable).where(eq(ordersTable.id, id));
    res.status(result.affectedRows ? 204 : 404).json({
      message: result.affectedRows ? 'Order deleted' : 'Order not found',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
}
