import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { Router } from 'express';
import { tagsTable } from '../../db/schema/tags';
import { registerTag, selectTags } from './controller';

const registerSchema = createInsertSchema(tagsTable).omit({
  createdAt: true,
  updatedAt: true,
});

const updateSchema = createUpdateSchema(tagsTable).omit({
  createdAt: true,
  updatedAt: true,
});

const router = Router();

router.get('/', selectTags);
router.post('/', registerTag);

export default router;
