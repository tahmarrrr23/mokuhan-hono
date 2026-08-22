import { z } from "@hono/zod-openapi";

export const userIdSchema = z.number();

export const userSchema = z
  .object({
    id: userIdSchema,
    name: z.string(),
  })
  .openapi("User");

export const createUserSchema = userSchema
  .omit({
    id: true,
  })
  .openapi("CreateUser");

export const updateUserSchema = createUserSchema
  .partial()
  .openapi("UpdateUser");
