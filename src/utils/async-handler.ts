import { RequestHandler } from "express";

// Wraps async route handlers so errors reach Express error middleware.
export const asyncHandler = (handler: RequestHandler): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
};
