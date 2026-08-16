import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/User.model";
import { ApiError } from "../utils/ApiError";

/**
 * Role Guards Middleware.
 * Enforces allowed user roles for protected routes.
 */
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `User role '${req.user.role}' is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};

export const requireRole = authorizeRoles;
export const isAdmin = authorizeRoles("admin");
export const isStudent = authorizeRoles("student", "admin");
