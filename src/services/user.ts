import type { z } from "@hono/zod-openapi";
import type { Prisma } from "@prisma/client";
import type {
  UserCreate,
  UserResponse,
  UserResponseWithDetails,
  UserUpdate,
} from "../schemas/user.js";
import { toArticleResponse } from "./article.js";

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

export function toUserResponse(
  db: Prisma.UserGetPayload<{ include: undefined }>,
): z.infer<typeof UserResponse> {
  return {
    id: db.id,
    email: db.email,
    username: db.username,
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
  };
}

export function toUserResponseWithDetails(
  db: Prisma.UserGetPayload<{ include: { articles: true } }>,
): z.infer<typeof UserResponseWithDetails> {
  return {
    id: db.id,
    email: db.email,
    username: db.username,
    articles: db.articles.map(toArticleResponse),
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
  };
}
