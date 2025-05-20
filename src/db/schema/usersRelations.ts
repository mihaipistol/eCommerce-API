import { relations } from 'drizzle-orm';
import { usersTable } from './users';
import { refreshTokensTable } from './refreshTokens';
import { passwordsTable } from './passwords';

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  passwords: many(passwordsTable),
  refreshTokens: many(refreshTokensTable),
}));
