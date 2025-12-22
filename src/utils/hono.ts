import { OpenAPIHono, z } from "@hono/zod-openapi";
import type { Env } from "hono";
import type { ErrorResponse } from "../schemas/error.js";

export function createOpenApiHono<E extends Env = Env>() {
  const app = new OpenAPIHono<E>({
    defaultHook: (result) => {
      if (!result.success) {
        throw result.error;
      }
    },
  });

  app.onError((err, c) => {
    if (err instanceof z.ZodError) {
      return c.json(
        {
          message: "Validation Error",
          detail: err,
        } satisfies z.infer<typeof ErrorResponse>,
        400,
      );
    } else {
      return c.json(
        {
          message: "Internal Server Error",
          detail: err,
        } satisfies z.infer<typeof ErrorResponse>,
        500,
      );
    }
  });

  return app;
}
