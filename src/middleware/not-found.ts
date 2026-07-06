import {RequestHandler} from "express";

// Sends a consistent response for unmatched routes.
export const notFound: RequestHandler = (_req, res, _next) => {
    res.status(404).json({
        status: "error",
        message: "Route not found",
    });
};
