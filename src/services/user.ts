import type { z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { users } from "../db/schema.js";
import { db } from "../libs/db.js";
import type { UserCreate, UserUpdate } from "../schemas/user.js";

export async function createUser(body: z.infer<typeof UserCreate>) {
  const [user] = await db.insert(users).values(body).returning();

  if (!user) {
    throw new Error("Failed to create user");
  }

  return user;
}

export async function updateUser(id: string, body: z.infer<typeof UserUpdate>) {
  const [user] = await db
    .update(users)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();

  if (!user) {
    throw new Error(`User not found: ${id}`);
  }

  return user;
}

export async function readUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);

  if (!user) {
    throw new Error(`User not found: ${id}`);
  }

  return user;
}
