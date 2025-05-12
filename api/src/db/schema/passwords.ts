import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { usersTable } from './users.js';

export const passwordsTable = mysqlTable('passwords', {
  id: int().references(() => usersTable.id),
  hash: varchar({ length: 255 }).notNull(),
  salt: varchar({ length: 16 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});
