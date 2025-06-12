import { mysqlTable, serial, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { UserRole, UserStatus } from '../../types';
import { relations } from 'drizzle-orm';
import { passwordsTable } from './passwords';
import { refreshTokensTable } from './refreshTokens';

export const usersTable = mysqlTable('users', {
  id: serial().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  status: varchar({ length: 50 }).notNull().default(UserStatus.PENDING),
  role: varchar({ length: 50 }).notNull().default(UserRole.USER),
  firstName: varchar({ length: 255 }),
  lastName: varchar({ length: 255 }),
  image: varchar({ length: 255 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  passwords: many(passwordsTable),
  refreshTokens: many(refreshTokensTable),
}));
