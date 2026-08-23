import { z } from "@hono/zod-openapi";

const resourceIdSchema = z.number().int().positive();
const postTitleSchema = z.string().max(255);
const postBodySchema = z.string();

export const userIdParamsSchema = z.object({
  userId: z.preprocess(Number, resourceIdSchema).openapi({
    type: "number",
    param: {
      name: "userId",
      in: "path",
      required: true,
    },
  }),
});

export const postIdParamsSchema = userIdParamsSchema.extend({
  postId: z.preprocess(Number, resourceIdSchema).openapi({
    type: "number",
    param: {
      name: "postId",
      in: "path",
      required: true,
    },
  }),
});

export const listPostsQuerySchema = z.object({
  isDraft: z
    .preprocess((value) => {
      if (value === "true") return true;
      if (value === "false") return false;
      return value;
    }, z.boolean())
    .openapi({
      type: "boolean",
      param: {
        name: "isDraft",
        in: "query",
      },
    })
    .optional(),
});

export const postAuthorSchema = z
  .object({
    id: resourceIdSchema,
    name: z.string(),
  })
  .openapi("PostAuthor");

export const postSchema = z
  .object({
    id: resourceIdSchema,
    isDraft: z.boolean(),
    title: postTitleSchema,
    body: postBodySchema,
    author: postAuthorSchema,
  })
  .openapi("Post");

export type Post = z.infer<typeof postSchema>;

export const createPostSchema = z
  .object({
    title: postTitleSchema,
    body: postBodySchema,
    isDraft: z.boolean().optional(),
  })
  .openapi("CreatePost");

export type CreatePost = z.infer<typeof createPostSchema>;

export const updatePostSchema = z
  .object({
    title: postTitleSchema.optional(),
    body: postBodySchema.optional(),
    isDraft: z.boolean().optional(),
  })
  .refine(
    ({ title, body, isDraft }) =>
      title !== undefined || body !== undefined || isDraft !== undefined,
    { message: "At least one field is required" },
  )
  .openapi("UpdatePost");

export type UpdatePost = z.infer<typeof updatePostSchema>;
