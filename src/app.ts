import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import diceRoutes from "./features/dice/routes.js";
import usersRoutes from "./features/users/routes.js";

const app = new OpenAPIHono();

app.route("/dice", diceRoutes);
app.route("/users", usersRoutes);

app.doc31("/openapi.json", {
  openapi: "3.1.0",
  info: {
    title: "hono-mokuhan",
    version: "1.0.0",
  },
});

app.notFound((c) =>
  c.json({ code: "NOT_FOUND", message: "Not found", detail: {} }, 404),
);

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json(
      {
        code: "HTTP_ERROR",
        message: error.message,
        detail: {},
      },
      error.status,
    );
  }

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
