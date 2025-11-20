import { z } from "@hono/zod-openapi";
import { UserRead } from "./user.js";

export const ArticleId = z
  .object({
    id: z.cuid(),
  })
  .openapi("ArticleId");

export const ArticleBase = z.object({
  id: ArticleId.shape.id,
  title: z.string(),
  content: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ArticleRead = ArticleBase.extend({
  author: UserRead,
}).openapi("ArticleRead");
