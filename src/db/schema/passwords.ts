import {
  bigint,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { usersTable } from './users';

export const passwordsTable = mysqlTable('passwords', {
  id: serial().primaryKey(),
  userId: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => usersTable.id),
  hash: varchar({ length: 255 }).notNull(),
  salt: varchar({ length: 16 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});
