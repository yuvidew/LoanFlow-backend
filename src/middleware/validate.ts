import { RequestHandler } from "express";
import { ZodType } from "zod";

// Validates request body, query, and params with a Zod schema.
export const validate =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      return next(error);
    }
  };
