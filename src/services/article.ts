import type { z } from "@hono/zod-openapi";
import type { Prisma } from "@prisma/client";
import type {
  ArticleCreate,
  ArticleResponse,
  ArticleResponseWithDetails,
  ArticleUpdate,
} from "../schemas/article.js";
import { toUserResponse } from "./user.js";

export function toArticleCreate(
  schema: z.infer<typeof ArticleCreate>,
): Prisma.ArticleCreateInput {
  return {
    draft: schema.draft,
    title: schema.title,
    content: schema.content,
    author: { connect: { id: schema.authorId } },
  };
}

export function toArticleUpdate(
  schema: z.infer<typeof ArticleUpdate>,
): Prisma.ArticleUpdateInput {
  return {
    draft: schema.draft,
    title: schema.title,
    content: schema.content,
    author: { connect: { id: schema.authorId } },
  };
}

export const toArticleResponse = (
  db: Prisma.ArticleGetPayload<{ include: undefined }>,
): z.infer<typeof ArticleResponse> => ({
  id: db.id,
  draft: db.draft,
  title: db.title,
  content: db.content,
  authorId: db.authorId,
  createdAt: db.createdAt,
  updatedAt: db.updatedAt,
});

export const toArticleResponseWithDetails = (
  db: Prisma.ArticleGetPayload<{ include: { author: true } }>,
): z.infer<typeof ArticleResponseWithDetails> => ({
  id: db.id,
  draft: db.draft,
  title: db.title,
  content: db.content,
  author: toUserResponse(db.author),
  createdAt: db.createdAt,
  updatedAt: db.updatedAt,
});
