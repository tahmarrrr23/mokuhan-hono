import { asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema/users.js";

export const listUsers = () =>
  db.select().from(usersTable).orderBy(asc(usersTable.id));

export const findUserById = async (id: number) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  return user;
};

export const createUser = async (name: string) => {
  const [user] = await db.insert(usersTable).values({ name }).returning();
  return user;
};

export const updateUser = async (id: number, values: { name?: string }) => {
  const [user] = await db
    .update(usersTable)
    .set(values)
    .where(eq(usersTable.id, id))
    .returning();
  return user;
};

export const deleteUser = async (id: number) => {
  const [user] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, id))
    .returning({ id: usersTable.id });
  return user;
};
