import { snakeCase } from "drizzle-orm/pg-core";

export const usersTable = snakeCase.table("users", (t) => ({
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar({ length: 255 }).notNull(),
}));
