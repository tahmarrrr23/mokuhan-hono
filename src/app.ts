import { OpenAPIHono } from "@hono/zod-openapi";
import { APP_NAME, APP_VERSION } from "./constants.js";
import usersRoutes from "./features/users/routes.js";

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          detail: {},
        },
        500,
      );
    }
  },
});

app.route("/users", usersRoutes);

app.doc31("/openapi.json", {
  openapi: "3.1.0",
  info: {
    title: APP_NAME,
    version: APP_VERSION,
  },
});

app.notFound((c) =>
  c.json(
    {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
      detail: {},
    },
    500,
  ),
);

app.onError((error, c) => {
  console.error(error);
  return c.json(
    {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
      detail: {},
    },
    500,
  );
});

export type AppType = typeof app;
export default app;
