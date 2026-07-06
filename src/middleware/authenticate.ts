import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { ApiError } from "../utils/api-error";

interface JwtPayload {
  id: string;
}

// Verifies the auth cookie token and attaches the user to the request.
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Cookies:", req.cookies);

    const token = req.cookies?.accessToken;

    console.log("Token:", token);

    if (!token) {
      return next(new ApiError(401, "Token not found"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    console.log("Decoded:", decoded);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    console.log("User:", user);

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    req.user = user;

    return next();
  } catch (error) {
    console.log("AUTH ERROR:", error);

    return next(new ApiError(401, "Invalid or expired token"));
  }
};
