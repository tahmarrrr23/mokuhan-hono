import { z } from "@hono/zod-openapi";
import { UserRead } from "./user.js";

export const ArticleBase = z.object({
  id: z.uuid(),
  title: z.string(),
  content: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ArticleRead = ArticleBase.extend({
  author: UserRead,
}).openapi("ArticleRead");
