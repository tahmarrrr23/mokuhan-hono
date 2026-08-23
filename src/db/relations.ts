import { defineRelations } from "drizzle-orm";

import { postsTable } from "./schema/posts.js";
import { usersTable } from "./schema/users.js";

export const relations = defineRelations(
  { posts: postsTable, users: usersTable },
  (r) => ({
    posts: {
      author: r.one.users({
        from: r.posts.authorId,
        to: r.users.id,
        optional: false,
      }),
    },
    users: {
      posts: r.many.posts(),
    },
  }),
);
