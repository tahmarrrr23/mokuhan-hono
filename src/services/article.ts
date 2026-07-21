import { eq } from "drizzle-orm";
import { articles, users } from "../db/schema.js";
import { db } from "../libs/db.js";

export async function readArticles() {
  return db
    .select({
      id: articles.id,
      title: articles.title,
      content: articles.content,
      createdAt: articles.createdAt,
      updatedAt: articles.updatedAt,
      author: {
        id: users.id,
        username: users.username,
        nickname: users.nickname,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      },
    })
    .from(articles)
    .innerJoin(users, eq(articles.authorId, users.id));
}
