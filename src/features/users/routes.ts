import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  internalErrorResponse,
  notFoundResponse,
  validationErrorResponse,
} from "../../errors.js";
import {
  createUserSchema,
  updateUserSchema,
  userIdParamsSchema,
  userSchema,
} from "./schemas.js";
import {
  createUser,
  deleteUser,
  findUser,
  listUsers,
  updateUser,
} from "./service.js";

const usersRoutes = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          detail: {
            issues: result.error.issues.map((issue) => ({
              path: issue.path.map(String).join("."),
              message: issue.message,
            })),
          },
        },
        400,
      );
    }
  },
});

const listUsersRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Users"],
  responses: {
    200: {
      content: { "application/json": { schema: z.array(userSchema) } },
      description: "List users",
    },
    500: internalErrorResponse,
  },
});

usersRoutes.openapi(listUsersRoute, async (c) => {
  const users = await listUsers();
  return c.json(users, 200);
});

const getUserRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Users"],
  request: { params: userIdParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: userSchema } },
      description: "Get a user",
    },
    400: validationErrorResponse,
    404: notFoundResponse,
    500: internalErrorResponse,
  },
});

usersRoutes.openapi(getUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = await findUser(id);

  if (!user) {
    return c.json(
      { code: "USER_NOT_FOUND", message: "User not found", detail: {} },
      404,
    );
  }

  return c.json(user, 200);
});

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
    400: validationErrorResponse,
    500: internalErrorResponse,
  },
});

usersRoutes.openapi(createUserRoute, async (c) => {
  const { name } = c.req.valid("json");
  const user = await createUser(name);
  return c.json(user, 201);
});

const updateUserRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Users"],
  request: {
    params: userIdParamsSchema,
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
    400: validationErrorResponse,
    404: notFoundResponse,
    500: internalErrorResponse,
  },
});

usersRoutes.openapi(updateUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  const values = c.req.valid("json");
  const user = await updateUser(id, values);

  if (!user) {
    return c.json(
      { code: "USER_NOT_FOUND", message: "User not found", detail: {} },
      404,
    );
  }

  return c.json(user, 200);
});

const deleteUserRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Users"],
  request: { params: userIdParamsSchema },
  responses: {
    204: { description: "User deleted" },
    400: validationErrorResponse,
    404: notFoundResponse,
    500: internalErrorResponse,
  },
});

usersRoutes.openapi(deleteUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = await deleteUser(id);

  if (!user) {
    return c.json(
      { code: "USER_NOT_FOUND", message: "User not found", detail: {} },
      404,
    );
  }

  return c.body(null, 204);
});

export default usersRoutes;
