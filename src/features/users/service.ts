import { asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";

export const listUsers = () => db.select().from(users).orderBy(asc(users.id));

export const findUser = async (id: number) => {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
};

export const createUser = async (name: string) => {
  const [user] = await db.insert(users).values({ name }).returning();
  return user;
};

export const updateUser = async (id: number, values: { name?: string }) => {
  const [user] = await db
    .update(users)
    .set(values)
    .where(eq(users.id, id))
    .returning();
  return user;
};

export const deleteUser = async (id: number) => {
  const [user] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ id: users.id });
  return user;
};
