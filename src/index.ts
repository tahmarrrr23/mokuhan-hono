import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { articleRoute } from "./routes/article.js";
import { userRoute } from "./routes/user.js";

const PORT = Number(process.env.PORT) || 8080;

const app = new OpenAPIHono();

app.get("/health", (c) => c.text("ok"));

app.use("*", logger());
app.use("*", cors());

app.route("/users", userRoute);
app.route("/articles", articleRoute);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  // @ts-expect-error
  info: {
    title: "Hono Ignition",
    description:
      "My personal Hono boilerplate for fast, consistent, and modern API.",
  },
});

const server = serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
