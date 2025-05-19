import { relations } from 'drizzle-orm';
import { usersTable } from './users';
import { passwordsTable } from './passwords';

export const passwordsRelation = relations(passwordsTable, ({ one }) => ({
  password: one(usersTable, {
    fields: [passwordsTable.userId],
    references: [usersTable.id],
  }),
}));
