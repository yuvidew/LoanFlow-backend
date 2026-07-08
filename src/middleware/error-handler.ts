import { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error";

// Converts thrown errors into consistent API responses.
export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (
    err instanceof ApiError ||
    (typeof err?.statusCode === "number" && typeof err?.message === "string")
  ) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      message: err.issues[0]?.message ?? "Invalid request payload",
      errors: err.flatten(),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        status: "error",
        message: "A record with this value already exists.",
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Record not found.",
      });
    }

    if (err.code === "P2020") {
      return res.status(400).json({
        status: "error",
        message: "One of the submitted numeric values is outside the allowed range.",
      });
    }
  }

  console.error("Unexpected error:", err);

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};
