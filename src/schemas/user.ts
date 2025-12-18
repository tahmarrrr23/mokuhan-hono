import { z } from "@hono/zod-openapi";

export const UserId = z
  .object({
    id: z.cuid(),
  })
  .openapi("UserId");

export const UserBase = z.object({
  id: UserId.shape.id,
  username: z.string(),
  nickname: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserCreate = UserBase.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).openapi("UserCreate");

export const UserUpdate = UserCreate.partial().openapi("UserUpdate");

export const UserRead = UserBase.openapi("UserRead");
