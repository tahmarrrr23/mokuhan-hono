import { serve } from "@hono/node-server";
import { Scalar } from "@scalar/hono-api-reference";
import "dotenv/config";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { articleRoute } from "./routes/article.js";
import { userRoute } from "./routes/user.js";
import { createOpenApiHono } from "./utils/hono.js";

const app = createOpenApiHono();

app.get("/health", (c) => c.text("ok"));
app.get("/scalar", Scalar({ url: "/openapi.json" }));
app.use("*", logger());
app.use("*", cors());
app.route("/users", userRoute);
app.route("/articles", articleRoute);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "hono-mokuhan",
    version: "0.0.0",
    description:
      "My personal Hono boilerplate for fast, consistent, and modern API.",
  },
});

const server = serve({ fetch: app.fetch, port: 8080 }, (info) => {
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
