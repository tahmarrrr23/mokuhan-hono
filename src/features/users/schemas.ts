import { z } from "@hono/zod-openapi";

export const userSchema = z
  .object({
    id: z.number().int().positive().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Taro Yamada" }),
  })
  .openapi("User");

export const userIdParamsSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive()
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: 1,
    }),
});

export const createUserSchema = z
  .object({
    name: z.string().trim().min(1).max(255).openapi({ example: "Taro Yamada" }),
  })
  .openapi("CreateUser");

export const updateUserSchema = createUserSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  })
  .openapi("UpdateUser");
