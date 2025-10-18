import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../libs/db.js";
import { ArticleResponse } from "../schemas/article.js";
import {
  UserCreate,
  UserId,
  UserResponse,
  UserUpdate,
} from "../schemas/user.js";
import { toArticleResponse } from "../services/article.js";
import {
  toUserCreate,
  toUserResponse,
  toUserResponseWithDetails,
  toUserUpdate,
} from "../services/user.js";

const userRoute = new OpenAPIHono();
const tags = ["User"];

const routes = {
  // GET: /users
  getUsers: createRoute({
    method: "get",
    path: "/",
    tags: tags,
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: z.array(UserResponse),
          },
        },
      },
    },
  }),
  // GET: /users/{id}
  getUsersId: createRoute({
    method: "get",
    path: "/{id}",
    tags: tags,
    request: {
      params: UserId,
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: UserResponse,
          },
        },
      },
    },
  }),
  getUsersIdArticles: createRoute({
    method: "get",
    path: "/{id}/articles",
    tags: tags,
    request: {
      params: UserId,
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: z.array(ArticleResponse),
          },
        },
      },
    },
  }),
  // POST: /users
  postUsers: createRoute({
    method: "post",
    path: "/",
    tags: tags,
    request: {
      body: {
        content: {
          "application/json": {
            schema: UserCreate,
          },
        },
      },
    },
    responses: {
      201: {
        description: "OK",
        content: {
          "application/json": {
            schema: UserResponse,
          },
        },
      },
    },
  }),
  // PATCH: /users/{id}
  patchUsersId: createRoute({
    method: "patch",
    path: "/{id}",
    tags: tags,
    request: {
      params: UserId,
      body: {
        content: {
          "application/json": {
            schema: UserUpdate,
          },
        },
      },
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: UserResponse,
          },
        },
      },
    },
  }),
  // DELETE: /users/{id}
  deleteUsersId: createRoute({
    method: "delete",
    path: "/{id}",
    tags: tags,
    request: {
      params: UserId,
    },
    responses: {
      204: {
        description: "No Content",
      },
    },
  }),
};

userRoute.openapi(routes.postUsers, async (c) => {
  const user = await db.user.create({
    data: toUserCreate(c.req.valid("json")),
  });
  return c.json(toUserResponse(user), 201);
});

userRoute.openapi(routes.getUsers, async (c) => {
  const users = await db.user.findMany();
  return c.json(users.map(toUserResponse), 200);
});

userRoute.openapi(routes.getUsersId, async (c) => {
  const user = await db.user.findUniqueOrThrow({
    where: { id: c.req.param("id") },
    include: { articles: true },
  });
  return c.json(toUserResponseWithDetails(user), 200);
});

userRoute.openapi(routes.patchUsersId, async (c) => {
  const user = await db.user.update({
    where: { id: c.req.param("id") },
    data: toUserUpdate(c.req.valid("json")),
  });
  return c.json(toUserResponse(user), 200);
});

userRoute.openapi(routes.deleteUsersId, async (c) => {
  await db.user.delete({ where: { id: c.req.param("id") } });
  return c.body(null, 204);
});

userRoute.openapi(routes.getUsersIdArticles, async (c) => {
  const articles = await db.article.findMany({
    where: { authorId: c.req.param("id") },
  });
  return c.json(articles.map(toArticleResponse), 200);
});

export { userRoute };
