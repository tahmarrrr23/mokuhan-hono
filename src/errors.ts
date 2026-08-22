import { z } from "@hono/zod-openapi";

export const errorSchema = z
  .object({
    code: z.string(),
    message: z.string(),
    detail: z.record(z.string(), z.unknown()),
  })
  .openapi("Error");
