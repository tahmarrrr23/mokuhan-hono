import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { errorSchema } from "../../errors.js";
import { toUserResponse } from "./mappers.js";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  userSchema,
} from "./schemas.js";
import {
  createUser,
  deleteUser,
  findUserById,
  listUsers,
  updateUser,
} from "./service.js";

const usersRoutes = new OpenAPIHono();

// GET: /users
const listUsersRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Users"],
  responses: {
    200: {
      content: { "application/json": { schema: z.array(userSchema) } },
      description: "List users",
    },
    500: {
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
      description: "Internal server error",
    },
  },
});

usersRoutes.openapi(listUsersRoute, async (c) => {
  const users = await listUsers();
  return c.json(users.map(toUserResponse), 200);
});

// GET: /users/{id}
const getUserRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Users"],
  request: {
    params: z.object({
      id: z.preprocess(Number, userIdSchema).openapi({
        type: "number",
        param: {
          name: "id",
          in: "path",
          required: true,
        },
      }),
    }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: userSchema } },
      description: "Get a user",
    },
    500: {
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
      description: "Internal server error",
    },
  },
});

usersRoutes.openapi(getUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = await findUserById(id);

  if (!user) {
    return c.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        detail: {},
      },
      500,
    );
  }

  return c.json(toUserResponse(user), 200);
});

// POST: /users
const createUserRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Users"],
  request: {
    body: {
      content: { "application/json": { schema: createUserSchema } },
      required: true,
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: userSchema } },
      description: "User created",
    },
    500: {
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
      description: "Internal server error",
    },
  },
});

usersRoutes.openapi(createUserRoute, async (c) => {
  const { name } = c.req.valid("json");
  const user = await createUser(name);
  return c.json(toUserResponse(user), 201);
});

// PATCH: /users/{id}
const updateUserRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Users"],
  request: {
    params: z.object({
      id: z.preprocess(Number, userIdSchema).openapi({
        type: "number",
        param: {
          name: "id",
          in: "path",
          required: true,
        },
      }),
    }),
    body: {
      content: { "application/json": { schema: updateUserSchema } },
      required: true,
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: userSchema } },
      description: "User updated",
    },
    500: {
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
      description: "Internal server error",
    },
  },
});

usersRoutes.openapi(updateUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  const { name } = c.req.valid("json");
  const user = await updateUser(id, name);

  if (!user) {
    return c.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        detail: {},
      },
      500,
    );
  }

  return c.json(toUserResponse(user), 200);
});

// DELETE: /users/{id}
const deleteUserRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Users"],
  request: {
    params: z.object({
      id: z.preprocess(Number, userIdSchema).openapi({
        type: "number",
        param: {
          name: "id",
          in: "path",
          required: true,
        },
      }),
    }),
  },
  responses: {
    204: { description: "User deleted" },
    500: {
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
      description: "Internal server error",
    },
  },
});

usersRoutes.openapi(deleteUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = await deleteUser(id);

  if (!user) {
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

export default usersRoutes;
