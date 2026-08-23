import { index, snakeCase } from "drizzle-orm/pg-core";

import { usersTable } from "./users.js";

export const postsTable = snakeCase.table(
  "posts",
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    isDraft: t.boolean().notNull().default(true),
    title: t.varchar({ length: 255 }).notNull(),
    body: t.text().notNull(),
    authorId: t
      .integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  }),
  (table) => [index().on(table.authorId)],
);
