import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { postsTable } from "../../db/schema/posts.js";
import type { CreatePost, UpdatePost } from "./schemas.js";

export async function listPostsByAuthorId(authorId: number, isDraft?: boolean) {
  const author = await db.query.users.findFirst({
    columns: {
      id: true,
      name: true,
    },
    where: {
      id: authorId,
    },
    with: {
      posts: {
        where: isDraft === undefined ? undefined : { isDraft },
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (!author) return undefined;

  return author.posts.map((post) => ({
    ...post,
    author: {
      id: author.id,
      name: author.name,
    },
  }));
}

export async function findPostByIdAndAuthorId(id: number, authorId: number) {
  return db.query.posts.findFirst({
    where: {
      id,
      authorId,
    },
    with: {
      author: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function createPost(authorId: number, input: CreatePost) {
  return db.transaction(async (tx) => {
    const author = await tx.query.users.findFirst({
      columns: {
        id: true,
        name: true,
      },
      where: {
        id: authorId,
      },
    });

    if (!author) return undefined;

    const [post] = await tx
      .insert(postsTable)
      .values({
        authorId,
        title: input.title,
        body: input.body,
        isDraft: input.isDraft,
      })
      .returning();

    return { ...post, author };
  });
}

export async function updatePostByIdAndAuthorId(
  id: number,
  authorId: number,
  input: UpdatePost,
) {
  return db.transaction(async (tx) => {
    const author = await tx.query.users.findFirst({
      columns: {
        id: true,
        name: true,
      },
      where: {
        id: authorId,
      },
    });

    if (!author) return undefined;

    const [post] = await tx
      .update(postsTable)
      .set(input)
      .where(and(eq(postsTable.id, id), eq(postsTable.authorId, authorId)))
      .returning();

    if (!post) return undefined;

    return { ...post, author };
  });
}

export async function deletePostByIdAndAuthorId(id: number, authorId: number) {
  const [post] = await db
    .delete(postsTable)
    .where(and(eq(postsTable.id, id), eq(postsTable.authorId, authorId)))
    .returning({ id: postsTable.id });
  return post;
}
