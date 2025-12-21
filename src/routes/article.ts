import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { ArticleRead } from "../schemas/article.js";
import { BadRequest, InternalServerError } from "../schemas/error.js";
import { readArticles } from "../services/article.js";

const articleRoute = new OpenAPIHono();
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
      400: BadRequest,
      500: InternalServerError,
    },
  }),
  async (c) => {
    const articles = await readArticles();
    return c.json(articles, 200);
  },
);

export { articleRoute };
