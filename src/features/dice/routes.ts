import { randomInt } from "node:crypto";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const diceRoutes = new OpenAPIHono();

const rollDiceRoute = createRoute({
  method: "post",
  path: "/roll",
  tags: ["Dice"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            result: z.number().int().min(1).max(6).openapi({ example: 4 }),
          }),
        },
      },
      description: "Roll a six-sided die",
    },
  },
});

diceRoutes.openapi(rollDiceRoute, (c) => {
  return c.json({ result: randomInt(1, 7) }, 200);
});

export default diceRoutes;
