import type { z } from "@hono/zod-openapi";
import type { Prisma } from "@prisma/client";
import type { UserCreate, UserRead, UserUpdate } from "../schemas/user.js";

export function toUserCreate(
  schema: z.infer<typeof UserCreate>,
): Prisma.UserCreateInput {
  return {
    username: schema.username,
    nickname: schema.nickname,
  };
}

export function toUserUpdate(
  schema: z.infer<typeof UserUpdate>,
): Prisma.UserUpdateInput {
  return {
    username: schema.username,
    nickname: schema.nickname,
  };
}

export function toUserRead(
  db: Prisma.UserGetPayload<undefined>,
): z.infer<typeof UserRead> {
  return {
    id: db.id,
    username: db.username,
    nickname: db.nickname,
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
  };
}
