import { createInsertSchema } from 'drizzle-zod';
import { Router } from 'express';
import { z } from 'zod';
import { usersTable } from '../../db/schema/users';
import { validateData } from '../../middleware/validation';
import { createSchema as passwordSchema } from '../password/router';
import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  getUsers,
  updateUser,
} from './controller';

const schema = createInsertSchema(usersTable)
  .extend({
    email: z.string().email(),
  })
  .omit({
    id: true,
    status: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  });

const createSchema = schema.partial().extend({
  password: z.string().min(8),
});

const updateSchema = createSchema.partial();

const router = Router();

router.get('/', getUsers);
router.get('/id/:id', getUserById);
router.get('/email/:email', getUserByEmail);
router.post('/', validateData(createSchema), createUser);
router.put('/:id', validateData(updateSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;
