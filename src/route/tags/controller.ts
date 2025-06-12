import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import getDatabase from '../../db';
import { tagsTable } from '../../db/schema/tags';

export async function selectTags(req: Request, res: Response): Promise<void> {
  const db = await getDatabase();
  try {
    const tags = await db.select().from(tagsTable);
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
}

export async function registerTag(req: Request, res: Response): Promise<void> {
  const db = await getDatabase();
  try {
    const [tagId] = await db.insert(tagsTable).values(req.body).$returningId();
    res.status(201).json(tagId);
  } catch (error) {
    console.error('Error registering tag:', error);
    res.status(500).json({ error: 'Failed to register tag' });
  }
}
