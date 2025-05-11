import { createInsertSchema } from 'drizzle-zod';
import { Router } from 'express';
import { z } from 'zod';
import { usersTable } from '../../db/schema/users';
import { PASSWORD_MIN_LENGTH } from '../../lib/constants';
import { validateData } from '../../middleware/validation';
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
  password: z.string().min(PASSWORD_MIN_LENGTH),
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
