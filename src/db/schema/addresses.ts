import {
  bigint,
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { usersTable } from './users';
import { relations, eq } from 'drizzle-orm';
import { db } from '..';

export const addressesTable = mysqlTable('addresses', {
  id: serial().primaryKey(),
  userId: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => usersTable.id),
  phone: varchar({ length: 255 }),
  address: varchar({ length: 255 }),
  city: varchar({ length: 255 }),
  state: varchar({ length: 255 }),
  country: varchar({ length: 255 }),
  zip: varchar({ length: 255 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

// Define a oen to one relation between users and addresses
// export const addressesRelation = relations(usersTable, ({ one }) => ({
//   address: one(addressesTable, {
//     fields: [usersTable.id],
//     references: [addressesTable.userId],
//   }),
// }));

// async function selectUsersWithAddresses(userId: number) {
//   return await db
//     .select()
//     .from(usersTable)
//     .leftJoin(addressesTable, eq(addressesTable.userId, usersTable.id))
//     .where(eq(usersTable.id, userId));
// }

// async function selectUsersWithAddresses(userId: number) {
//   return await db.query.users.findFirst({
//     with: {
//       address: true,
//     },
//     where: (usersTable, { eq }) => {
//       return eq(usersTable.id, userId);
//     },
//   });
// }
