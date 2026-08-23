import { OpenAPIHono } from "@hono/zod-openapi";
import { errorSchema } from "./errors.js";
import postsRoutes from "./features/posts/routes.js";
import usersRoutes from "./features/users/routes.js";

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        errorSchema.parse({
          code: "422",
          message: "Validation failed",
          detail: { issues: result.error.issues },
        }),
        400,
      );
    }
  },
});

app.notFound((c) =>
  c.json(
    errorSchema.parse({
      code: "404",
      message: "Not found",
      detail: {},
    }),
    404,
  ),
);

app.onError((_error, c) =>
  c.json(
    errorSchema.parse({
      code: "500",
      message: "Internal server error",
      detail: {},
    }),
    500,
  ),
);

app.route("/users", usersRoutes);
app.route("/users", postsRoutes);

export type AppType = typeof app;
export default app;
