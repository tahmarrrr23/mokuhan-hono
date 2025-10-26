import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { articleRoute } from "./routes/article.js";
import { userRoute } from "./routes/user.js";

const app = new OpenAPIHono();

app.get("/health", (c) => c.text("ok"));

app.use("*", logger());
app.use("*", cors());

app.route("/users", userRoute);
app.route("/articles", articleRoute);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    version: "",
    title: "Hono Ignition",
    description:
      "My personal Hono boilerplate for fast, consistent, and modern API.",
  },
});

serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
