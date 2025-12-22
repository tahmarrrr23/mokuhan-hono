import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import { HTTPException } from "hono/http-exception";

export function createOpenApiHono<E extends Env = Env>() {
  return new OpenAPIHono<E>({
    defaultHook: (result) => {
      if (!result.success) {
        console.log("Default Hook Triggered:", result.error);
        throw new HTTPException(400, {
          message: "Bad Request",
          cause: result.error,
        });
      }
    },
  });
}
