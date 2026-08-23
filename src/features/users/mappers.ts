import type { UserRow } from "../../db/schema/users.js";
import type { User } from "./schemas.js";

export function toUserResponse(user: Pick<UserRow, "id" | "name">): User {
  return {
    id: user.id,
    name: user.name,
  };
}
