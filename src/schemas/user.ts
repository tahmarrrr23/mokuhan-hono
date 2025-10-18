import { z } from "@hono/zod-openapi";
import { ArticleResponse } from "./article.js";

export const UserId = z.object({
  id: z.cuid(),
});

export const UserBase = z.object({
  id: UserId.shape.id,
  email: z.email(),
  username: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserCreate = UserBase.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UserUpdate = UserCreate.partial();

export const UserResponse = UserBase;

export const UserResponseWithDetails = UserResponse.extend({
  articles: z.array(ArticleResponse),
});
