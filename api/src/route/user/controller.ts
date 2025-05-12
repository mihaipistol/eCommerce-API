import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { usersTable } from '../../db/schema/users.js';

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const result = await db.select().from(usersTable);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function getUserByEmail(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const email = req.params.email;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const [existing] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, req.body.email));
    if (existing) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }
    const [result] = await db
      .insert(usersTable)
      .values(req.body)
      .$returningId();
    res.status(201).json({
      id: result.id,
      ...req.body,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }
    const [result] = await db
      .update(usersTable)
      .set(req.body)
      .where(eq(usersTable.id, userId));

    if (!result) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res
      .status(result.affectedRows ? 200 : 404)
      .json(
        result.affectedRows
          ? { id: userId, ...req.body }
          : { message: 'User not found' },
      );
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }
    const [result] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, userId));
    res.status(result.affectedRows ? 204 : 404).json({
      message: result.affectedRows ? 'User deleted' : 'User not found',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}
