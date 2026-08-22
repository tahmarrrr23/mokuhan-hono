import { asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema/users.js";

export async function listUsers() {
  const users = await db.select().from(usersTable).orderBy(asc(usersTable.id));
  return users;
}

export async function findUserById(id: number) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  return user;
}

export async function createUser(name: string) {
  const [user] = await db.insert(usersTable).values({ name }).returning();
  return user;
}

export async function updateUser(id: number, values: { name?: string }) {
  const [user] = await db
    .update(usersTable)
    .set(values)
    .where(eq(usersTable.id, id))
    .returning();
  return user;
}

export async function deleteUser(id: number) {
  const [user] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, id))
    .returning({ id: usersTable.id });
  return user;
}
