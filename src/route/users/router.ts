import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { Router } from 'express';
import { z } from 'zod';
import { usersTable } from '../../db/schema/users';
import { PASSWORD_MIN_LENGTH } from '../../lib/constants';
import { validateData } from '../../middleware/validation';
import {
  deleteUser,
  getUserByEmail,
  getUserById,
  getUsers,
  registerUser,
  updateUser,
} from './controller';

const registerSchema = createInsertSchema(usersTable)
  .extend({
    email: z.string().email(),
    password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .omit({
    id: true,
    status: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  });

const updateSchema = createUpdateSchema(usersTable);

const router = Router();

router.get('/', getUsers);
router.get('/id/:id', getUserById);
router.get('/email/:email', getUserByEmail);
router.post('/', validateData(registerSchema), registerUser);
router.put('/:id', validateData(updateSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;
