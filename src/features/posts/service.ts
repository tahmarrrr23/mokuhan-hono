import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { postsTable } from "../../db/schema/posts.js";
import { toPostResponse } from "./mappers.js";
import type { CreatePost, Post, UpdatePost } from "./schemas.js";

export async function listPostsByAuthorId(
  authorId: Post["author"]["id"],
  isDraft?: Post["isDraft"],
): Promise<Post[] | undefined> {
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

  return author.posts.map((post) => toPostResponse({ ...post, author }));
}

export async function findPostByIdAndAuthorId(
  id: Post["id"],
  authorId: Post["author"]["id"],
): Promise<Post | undefined> {
  const post = await db.query.posts.findFirst({
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
  return post && toPostResponse(post);
}

export async function createPost(
  authorId: Post["author"]["id"],
  input: CreatePost,
): Promise<Post | undefined> {
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

    return toPostResponse({ ...post, author });
  });
}

export async function updatePostByIdAndAuthorId(
  id: Post["id"],
  authorId: Post["author"]["id"],
  input: UpdatePost,
): Promise<Post | undefined> {
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

    return toPostResponse({ ...post, author });
  });
}

export async function deletePostByIdAndAuthorId(
  id: Post["id"],
  authorId: Post["author"]["id"],
): Promise<boolean> {
  const [post] = await db
    .delete(postsTable)
    .where(and(eq(postsTable.id, id), eq(postsTable.authorId, authorId)))
    .returning({ id: postsTable.id });
  return post !== undefined;
}
