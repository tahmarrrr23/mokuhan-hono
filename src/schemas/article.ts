import { z } from "@hono/zod-openapi";
import { UserId, UserResponse } from "./user.js";

export const ArticleId = z.object({
  id: z.cuid(),
});

export const ArticleBase = z.object({
  id: ArticleId.shape.id,
  draft: z.boolean(),
  title: z.string(),
  content: z.string().nullable(),
  authorId: UserId.shape.id,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ArticleCreate = ArticleBase.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const ArticleUpdate = ArticleCreate.partial();

export const ArticleResponse = ArticleBase;

export const ArticleResponseWithDetails = ArticleResponse.omit({
  authorId: true,
}).extend({
  author: UserResponse,
});
