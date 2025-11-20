import type { z } from "@hono/zod-openapi";
import { db } from "../libs/db.js";
import { toUserCreate, toUserRead, toUserUpdate } from "../mappers/user.js";
import type { UserCreate, UserUpdate } from "../schemas/user.js";

export async function createUser(body: z.infer<typeof UserCreate>) {
  const raw = toUserCreate(body);
  const user = await db.user.create({ data: raw });
  return toUserRead(user);
}

export async function updateUser(id: string, body: z.infer<typeof UserUpdate>) {
  const raw = toUserUpdate(body);
  const user = await db.user.update({ where: { id }, data: raw });
  return toUserRead(user);
}

export async function readUserById(id: string) {
  const user = await db.user.findUniqueOrThrow({ where: { id } });
  return toUserRead(user);
}
