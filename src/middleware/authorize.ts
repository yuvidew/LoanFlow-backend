import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { ApiError } from "../utils/api-error";

// Restricts a route to the allowed roles after authentication.
export const authorize =
  (...roles: Role[]) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    console.log("Logged In Role:", req.user?.role);
console.log("Allowed Roles:", roles);
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden"));
    }

    next();
  };
