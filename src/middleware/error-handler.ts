import { ErrorRequestHandler } from "express";
import { ApiError } from "../utils/api-error";

// Converts thrown errors into consistent API responses.
export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error("Unexpected error:", err);

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};
