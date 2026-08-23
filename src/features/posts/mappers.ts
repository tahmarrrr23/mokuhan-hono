import type { PostRow } from "../../db/schema/posts.js";
import type { UserRow } from "../../db/schema/users.js";
import type { Post } from "./schemas.js";

type PostWithAuthor = Pick<PostRow, "id" | "isDraft" | "title" | "body"> & {
  author: Pick<UserRow, "id" | "name">;
};

export function toPostResponse(post: PostWithAuthor): Post {
  return {
    id: post.id,
    isDraft: post.isDraft,
    title: post.title,
    body: post.body,
    author: {
      id: post.author.id,
      name: post.author.name,
    },
  };
}
