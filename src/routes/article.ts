import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../libs/db.js";
import {
  ArticleCreate,
  ArticleId,
  ArticleResponse,
  ArticleResponseWithDetails,
  ArticleUpdate,
} from "../schemas/article.js";
import {
  toArticleCreate,
  toArticleResponse,
  toArticleResponseWithDetails,
  toArticleUpdate,
} from "../services/article.js";

const articleRoute = new OpenAPIHono();
const tags = ["Article"];

const routes = {
  // GET: /articles
  getArticles: createRoute({
    method: "get",
    path: "/",
    tags: tags,
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: z.array(ArticleResponse),
          },
        },
      },
    },
  }),
  // GET: /articles/{id}
  getArticlesId: createRoute({
    method: "get",
    path: "/{id}",
    tags: tags,
    request: {
      params: ArticleId,
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: ArticleResponseWithDetails,
          },
        },
      },
    },
  }),
  // POST: /articles
  postArticles: createRoute({
    method: "post",
    path: "/",
    tags: tags,
    request: {
      body: {
        content: {
          "application/json": {
            schema: ArticleCreate,
          },
        },
      },
    },
    responses: {
      201: {
        description: "OK",
        content: {
          "application/json": {
            schema: ArticleResponse,
          },
        },
      },
    },
  }),
  // PATCH: /articles/{id}
  patchArticlesId: createRoute({
    method: "patch",
    path: "/{id}",
    tags: tags,
    request: {
      params: ArticleId,
      body: {
        content: {
          "application/json": {
            schema: ArticleUpdate,
          },
        },
      },
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: ArticleResponse,
          },
        },
      },
    },
  }),
  // DELETE: /articles/{id}
  deleteArticlesId: createRoute({
    method: "delete",
    path: "/{id}",
    tags: tags,
    request: {
      params: ArticleId,
    },
    responses: {
      204: {
        description: "No Content",
      },
    },
  }),
};

articleRoute.openapi(routes.postArticles, async (c) => {
  const article = await db.article.create({
    data: toArticleCreate(c.req.valid("json")),
  });
  return c.json(toArticleResponse(article), 201);
});

articleRoute.openapi(routes.getArticles, async (c) => {
  const articles = await db.article.findMany();
  return c.json(articles.map(toArticleResponse), 200);
});

articleRoute.openapi(routes.getArticlesId, async (c) => {
  const article = await db.article.findUniqueOrThrow({
    where: { id: c.req.param("id") },
    include: { author: true },
  });
  return c.json(toArticleResponseWithDetails(article), 200);
});

articleRoute.openapi(routes.patchArticlesId, async (c) => {
  const article = await db.article.update({
    where: { id: c.req.param("id") },
    data: toArticleUpdate(c.req.valid("json")),
  });
  return c.json(toArticleResponse(article), 200);
});

articleRoute.openapi(routes.deleteArticlesId, async (c) => {
  await db.article.delete({ where: { id: c.req.param("id") } });
  return c.body(null, 204);
});

export { articleRoute };
