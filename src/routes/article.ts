import { createRoute, z } from "@hono/zod-openapi";
import {
  ResponseBadRequest,
  ResponseInternalServerError,
} from "../openapi/responses.js";
import { ArticleRead } from "../schemas/article.js";
import { readArticles } from "../services/article.js";
import { createOpenApiHono } from "../utils/hono.js";

const articleRoute = createOpenApiHono();
const tags = ["Article"];

// GET: /articles
articleRoute.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: tags,
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: z.array(ArticleRead),
          },
        },
      },
      400: ResponseBadRequest,
      500: ResponseInternalServerError,
    },
  }),
  async (c) => {
    const articles = await readArticles();
    return c.json(articles, 200);
  },
);

export { articleRoute };
