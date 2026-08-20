import { z } from "@hono/zod-openapi";

export const errorResponseSchema = z
  .object({
    code: z.string(),
    message: z.string(),
    detail: z.record(z.string(), z.unknown()),
  })
  .openapi("ErrorResponse");

export const errorContent = {
  "application/json": {
    schema: errorResponseSchema,
  },
};

export const validationErrorResponse = {
  content: errorContent,
  description: "Invalid request",
} as const;

export const notFoundResponse = {
  content: errorContent,
  description: "Resource not found",
} as const;

export const internalErrorResponse = {
  content: errorContent,
  description: "Internal server error",
} as const;
