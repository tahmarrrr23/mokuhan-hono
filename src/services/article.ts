import { db } from "../libs/db.js";
import { toArticleRead } from "../mappers/article.js";

export async function readArticles() {
  const articles = await db.article.findMany({ include: { author: true } });
  return articles.map(toArticleRead);
}
