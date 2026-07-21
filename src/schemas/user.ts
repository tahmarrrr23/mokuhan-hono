import { z } from "@hono/zod-openapi";

export const UserBase = z.object({
  id: z.uuid(),
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

export const UserRead = UserBase.openapi("UserRead");

export const UserUpdate = UserCreate.partial().openapi("UserUpdate");
