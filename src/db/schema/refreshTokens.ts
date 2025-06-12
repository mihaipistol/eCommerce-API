import { relations } from 'drizzle-orm';
import {
  bigint,
  mysqlTable,
  serial,
  timestamp,
  varchar
} from 'drizzle-orm/mysql-core';
import { usersTable } from './users';

export const refreshTokensTable = mysqlTable('refresh_tokens', {
  id: serial().primaryKey(),
  userId: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => usersTable.id),
  token: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  expiresAt: timestamp().notNull(),
});

export const refreshTokensRelations = relations(
  refreshTokensTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [refreshTokensTable.userId],
      references: [usersTable.id],
    }),
  }),
);
