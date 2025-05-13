import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { UserRole, UserStatus } from '../../types';

export const usersTable = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  email: varchar({ length: 255 }).notNull().unique(),
  status: varchar({ length: 255 }).notNull().default(UserStatus.PENDING),
  role: varchar({ length: 255 }).notNull().default(UserRole.USER),
  firstName: varchar({ length: 255 }),
  lastName: varchar({ length: 255 }),
  phone: varchar({ length: 255 }),
  address: varchar({ length: 255 }),
  city: varchar({ length: 255 }),
  state: varchar({ length: 255 }),
  country: varchar({ length: 255 }),
  zip: varchar({ length: 255 }),
  image: varchar({ length: 255 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});
