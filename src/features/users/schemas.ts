import { z } from "@hono/zod-openapi";

export const userIdSchema = z.number();

export const userSchema = z
  .object({
    id: userIdSchema,
    name: z.string(),
  })
  .openapi("User");

export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema
  .omit({
    id: true,
  })
  .openapi("CreateUser");

export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema
  .partial()
  .openapi("UpdateUser");

export type UpdateUser = z.infer<typeof updateUserSchema>;
