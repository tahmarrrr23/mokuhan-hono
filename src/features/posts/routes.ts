import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { errorSchema } from "../../errors.js";
import { toPostResponse } from "./mappers.js";
import {
  createPostSchema,
  listPostsQuerySchema,
  postIdParamsSchema,
  postSchema,
  updatePostSchema,
  userIdParamsSchema,
} from "./schemas.js";
import {
  createPost,
  deletePostByIdAndAuthorId,
  findPostByIdAndAuthorId,
  listPostsByAuthorId,
  updatePostByIdAndAuthorId,
} from "./service.js";

const postsRoutes = new OpenAPIHono();

const listPostsRoute = createRoute({
  method: "get",
  path: "/{userId}/posts",
  tags: ["Posts"],
  request: {
    params: userIdParamsSchema,
    query: listPostsQuerySchema,
  },
  responses: {
    200: {
      content: { "application/json": { schema: z.array(postSchema) } },
      description: "List posts",
    },
    500: {
      content: { "application/json": { schema: errorSchema } },
      description: "Internal server error",
    },
  },
});

postsRoutes.openapi(listPostsRoute, async (c) => {
  const { userId } = c.req.valid("param");
  const { isDraft } = c.req.valid("query");
  const posts = await listPostsByAuthorId(userId, isDraft);

  if (!posts) {
    return c.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        detail: {},
      },
      500,
    );
  }

  return c.json(posts.map(toPostResponse), 200);
});

const getPostRoute = createRoute({
  method: "get",
  path: "/{userId}/posts/{postId}",
  tags: ["Posts"],
  request: {
    params: postIdParamsSchema,
  },
  responses: {
    200: {
      content: { "application/json": { schema: postSchema } },
      description: "Get a post",
    },
    500: {
      content: { "application/json": { schema: errorSchema } },
      description: "Internal server error",
    },
  },
});

postsRoutes.openapi(getPostRoute, async (c) => {
  const { userId, postId } = c.req.valid("param");
  const post = await findPostByIdAndAuthorId(postId, userId);

  if (!post) {
    return c.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        detail: {},
      },
      500,
    );
  }

  return c.json(toPostResponse(post), 200);
});

const createPostRoute = createRoute({
  method: "post",
  path: "/{userId}/posts",
  tags: ["Posts"],
  request: {
    params: userIdParamsSchema,
    body: {
      content: { "application/json": { schema: createPostSchema } },
      required: true,
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: postSchema } },
      description: "Post created",
    },
    500: {
      content: { "application/json": { schema: errorSchema } },
      description: "Internal server error",
    },
  },
});

postsRoutes.openapi(createPostRoute, async (c) => {
  const { userId } = c.req.valid("param");
  const input = c.req.valid("json");
  const post = await createPost(userId, input);

  if (!post) {
    return c.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        detail: {},
      },
      500,
    );
  }

  return c.json(toPostResponse(post), 201);
});

const updatePostRoute = createRoute({
  method: "patch",
  path: "/{userId}/posts/{postId}",
  tags: ["Posts"],
  request: {
    params: postIdParamsSchema,
    body: {
      content: { "application/json": { schema: updatePostSchema } },
      required: true,
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: postSchema } },
      description: "Post updated",
    },
    500: {
      content: { "application/json": { schema: errorSchema } },
      description: "Internal server error",
    },
  },
});

postsRoutes.openapi(updatePostRoute, async (c) => {
  const { userId, postId } = c.req.valid("param");
  const input = c.req.valid("json");
  const post = await updatePostByIdAndAuthorId(postId, userId, input);

  if (!post) {
    return c.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        detail: {},
      },
      500,
    );
  }

  return c.json(toPostResponse(post), 200);
});

const deletePostRoute = createRoute({
  method: "delete",
  path: "/{userId}/posts/{postId}",
  tags: ["Posts"],
  request: {
    params: postIdParamsSchema,
  },
  responses: {
    204: { description: "Post deleted" },
    500: {
      content: { "application/json": { schema: errorSchema } },
      description: "Internal server error",
    },
  },
});

postsRoutes.openapi(deletePostRoute, async (c) => {
  const { userId, postId } = c.req.valid("param");
  const post = await deletePostByIdAndAuthorId(postId, userId);

  if (!post) {
    return c.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        detail: {},
      },
      500,
    );
  }

  return c.body(null, 204);
});

export default postsRoutes;
