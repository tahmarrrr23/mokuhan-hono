import "dotenv/config";

import { serve } from "@hono/node-server";
import app from "./app.js";
import { HOSTNAME, PORT } from "./constants.js";

const server = serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT ?? PORT),
    hostname: process.env.HOSTNAME ?? HOSTNAME,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

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
