import { count, desc, eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../../db';
import { passwordsTable } from '../../db/schema/passwords';
import { PASSWORD_COUNT, SALT_LENGTH } from '../../lib/constants';
import { makeHash, makeSalt } from '../../lib/crypto';

export async function getPasswordById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const passwordId = parseInt(req.params.id, 10);
    if (isNaN(passwordId)) {
      res.status(400).json({ massage: 'Invalid password ID' });
      return;
    }
    const password = await db
      .select()
      .from(passwordsTable)
      .where(eq(passwordsTable.id, passwordId))
      .orderBy(desc(passwordsTable.createdAt));
    if (!password) {
      res.status(404).json({ massage: 'Password not found' });
      return;
    }
    res.json(password);
  } catch (error) {
    console.error('Error fetching password by ID:', error);
    res.status(500).json({ error: 'Failed to fetch password' });
  }
}

export async function registerPassword(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const password = {
      userId: req.body.userId,
      hash: '',
      salt: makeSalt(SALT_LENGTH),
    };
    password.hash = makeHash(req.body.password, password.salt);
    const [result] = await db
      .insert(passwordsTable)
      .values(password)
      .$returningId();
    await db.delete;
    res.status(201).json(result);
  } catch (error) {
    console.error('Error inserting password:', error);
    res.status(500).json({ error: 'Failed to create password' });
  }
}

export async function deletePassword(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid password ID' });
      return;
    }
    const [countResult]: { value: number }[] = await db
      .select({ value: count(passwordsTable.id) })
      .from(passwordsTable)
      .where(eq(passwordsTable.id, id));
    const [result] = await db
      .delete(passwordsTable)
      .where(eq(passwordsTable.id, id))
      .orderBy(desc(passwordsTable.createdAt))
      .limit(
        countResult.value < PASSWORD_COUNT
          ? 0
          : countResult.value - PASSWORD_COUNT,
      );
    res.status(result.affectedRows ? 204 : 404).json({
      message: result.affectedRows ? 'Password deleted' : 'Password not found',
    });
  } catch (error) {
    console.error('Error deleting password:', error);
    res.status(500).json({ error: 'Failed to delete password' });
  }
}
