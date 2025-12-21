import { z } from "@hono/zod-openapi";

export const ErrorResponse = z.object({
  message: z.string(),
  detail: z.any(),
});
