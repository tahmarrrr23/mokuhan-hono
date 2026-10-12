import { asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema/users.js";
import { toUserResponse } from "./mappers.js";
import type { CreateUser, UpdateUser, User } from "./schemas.js";

export async function listUsers(): Promise<User[]> {
  const users = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
    })
    .from(usersTable)
    .orderBy(asc(usersTable.id));
  return users.map(toUserResponse);
}

export async function findUserById(id: User["id"]): Promise<User | undefined> {
  const [user] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
    })
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  return user && toUserResponse(user);
}

export async function createUser(input: CreateUser): Promise<User> {
  const [user] = await db
    .insert(usersTable)
    .values({ name: input.name })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
    });
  return toUserResponse(user);
}

export async function updateUser(
  id: User["id"],
  input: UpdateUser,
): Promise<User | undefined> {
  const [user] = await db
    .update(usersTable)
    .set({ name: input.name })
    .where(eq(usersTable.id, id))
    .returning({
      id: usersTable.id,
      name: usersTable.name,
    });
  return user && toUserResponse(user);
}

export async function deleteUser(id: User["id"]): Promise<boolean> {
  const [user] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, id))
    .returning({ id: usersTable.id });
  return user !== undefined;
}
