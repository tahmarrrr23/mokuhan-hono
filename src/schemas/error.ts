import { z } from "@hono/zod-openapi";

export const ErrorResponse = z.object({
  message: z.string(),
  detail: z.any(),
});

export const InternalServerError = {
  description: "Internal Server Error",
  content: {
    "application/json": {
      schema: ErrorResponse,
    },
  },
};

export const BadRequest = {
  description: "Bad Request",
  content: {
    "application/json": {
      schema: ErrorResponse,
    },
  },
};
