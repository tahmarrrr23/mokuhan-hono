import type { z } from "@hono/zod-openapi";
import type { Prisma } from "@prisma/client";
import type { ArticleRead } from "../schemas/article.js";
import { toUserRead } from "./user.js";

export function toArticleRead(
  db: Prisma.ArticleGetPayload<{ include: { author: true } }>,
): z.infer<typeof ArticleRead> {
  return {
    id: db.id,
    title: db.title,
    content: db.content,
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
    author: toUserRead(db.author),
  };
}
