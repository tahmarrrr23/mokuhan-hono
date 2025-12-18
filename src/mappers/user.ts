import type { z } from "@hono/zod-openapi";
import type {
  UserCreateInput,
  UserGetPayload,
  UserUpdateInput,
} from "../libs/prisma/models.js";
import type { UserCreate, UserRead, UserUpdate } from "../schemas/user.js";

export function toUserCreate(
  schema: z.infer<typeof UserCreate>,
): UserCreateInput {
  return {
    username: schema.username,
    nickname: schema.nickname,
  };
}

export function toUserUpdate(
  schema: z.infer<typeof UserUpdate>,
): UserUpdateInput {
  return {
    username: schema.username,
    nickname: schema.nickname,
  };
}

export function toUserRead(
  db: UserGetPayload<undefined>,
): z.infer<typeof UserRead> {
  return {
    id: db.id,
    username: db.username,
    nickname: db.nickname,
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
  };
}
