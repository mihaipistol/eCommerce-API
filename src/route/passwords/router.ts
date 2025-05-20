import { createInsertSchema } from 'drizzle-zod';
import { Router } from 'express';
import { z } from 'zod';
import { passwordsTable } from '../../db/schema/passwords';
import { validateData } from '../../middleware/validation';
import {
  registerPassword as registerPassword,
  deletePassword,
  getPasswordById,
} from './controller';

export const registerSchema = createInsertSchema(passwordsTable)
  .extend({
    password: z.string().min(8),
  })
  .omit({
    hash: true,
    salt: true,
    createdAt: true,
  });

const router = Router();

router.get('/:id', getPasswordById);
router.post('/', validateData(registerSchema), registerPassword);
router.delete('/:id', deletePassword);

export default router;
