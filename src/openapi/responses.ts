import { ErrorResponse } from "../schemas/error.js";

export const ResponseInternalServerError = {
  description: "Internal Server Error",
  content: {
    "application/json": {
      schema: ErrorResponse,
    },
  },
};

export const ResponseBadRequest = {
  description: "Bad Request",
  content: {
    "application/json": {
      schema: ErrorResponse,
    },
  },
};
