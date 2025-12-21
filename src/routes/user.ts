import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  ResponseBadRequest,
  ResponseInternalServerError,
} from "../openapi/responses.js";
import { UserCreate, UserRead, UserUpdate } from "../schemas/user.js";
import { createUser, readUserById, updateUser } from "../services/user.js";

const userRoute = new OpenAPIHono();
const tags = ["User"];

// POST: /users
userRoute.openapi(
  createRoute({
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
            schema: UserRead,
          },
        },
      },
      400: ResponseBadRequest,
      500: ResponseInternalServerError,
    },
  }),
  async (c) => {
    const body = c.req.valid("json");
    const user = await createUser(body);
    return c.json(user, 201);
  },
);

// GET: /users/{id}
userRoute.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    tags: tags,
    request: {
      params: z.object({
        id: UserRead.shape.id,
      }),
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: UserRead,
          },
        },
      },
      400: ResponseBadRequest,
      500: ResponseInternalServerError,
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const user = await readUserById(id);
    return c.json(user, 200);
  },
);

// PATCH: /users/{id}
userRoute.openapi(
  createRoute({
    method: "patch",
    path: "/{id}",
    tags: tags,
    request: {
      params: z.object({
        id: UserRead.shape.id,
      }),
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
            schema: UserRead,
          },
        },
      },
      400: ResponseBadRequest,
      500: ResponseInternalServerError,
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const user = await updateUser(id, body);
    return c.json(user, 200);
  },
);

export { userRoute };
