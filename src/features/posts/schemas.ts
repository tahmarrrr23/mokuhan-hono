import { z } from "@hono/zod-openapi";

export const postIdSchema = z.number();

export const postSchema = z
  .object({
    id: postIdSchema,
    isDraft: z.boolean(),
    title: z.string(),
    body: z.string(),
    author: z.object({
      id: z.number(),
      name: z.string(),
    }),
  })
  .openapi("Post");

export type Post = z.infer<typeof postSchema>;

export const createPostSchema = postSchema
  .omit({
    id: true,
    author: true,
  })
  .partial({
    isDraft: true,
  })
  .openapi("CreatePost");

export type CreatePost = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema
  .partial()
  .openapi("UpdatePost");

export type UpdatePost = z.infer<typeof updatePostSchema>;
