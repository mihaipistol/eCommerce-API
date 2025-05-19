import { relations } from 'drizzle-orm';
import { refreshTokensTable } from './refreshTokens';
import { usersTable } from './users';

export const refreshTokensRelations = relations(
  refreshTokensTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [refreshTokensTable.userId],
      references: [usersTable.id],
    }),
  }),
);
