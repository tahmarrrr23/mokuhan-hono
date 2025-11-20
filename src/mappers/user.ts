import type { z } from "@hono/zod-openapi";
import type { Prisma } from "@prisma/client";
import type { UserCreate, UserRead, UserUpdate } from "../schemas/user.js";

export function toUserCreate(
  schema: z.infer<typeof UserCreate>,
): Prisma.UserCreateInput {
  return {
    email: schema.email,
    username: schema.username,
  };
}

export function toUserUpdate(
  schema: z.infer<typeof UserUpdate>,
): Prisma.UserUpdateInput {
  return {
    email: schema.email,
    username: schema.username,
  };
}

export function toUserRead(
  db: Prisma.UserGetPayload<undefined>,
): z.infer<typeof UserRead> {
  return {
    id: db.id,
    email: db.email,
    username: db.username,
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
  };
}
