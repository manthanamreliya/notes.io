import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { JwtPayloadUser } from "../types/express";

/**
 * JWT Authentication Middleware.
 * Verifies access token from httpOnly cookie or Authorization header and populates req.user.
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw ApiError.unauthorized("Authentication token required.");
    }

    const decoded = jwt.verify(token, env.jwtAccessSecret) as JwtPayloadUser;

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return next(ApiError.unauthorized("Invalid or expired authentication token."));
    }
    next(error);
  }
};
