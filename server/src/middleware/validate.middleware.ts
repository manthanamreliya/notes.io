import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

type ValidationFn = (data: unknown) => { isValid: boolean; errors: string[] };

/**
 * Middleware builder for validating request body with a given validator function.
 */
export const validateBody = (validator: ValidationFn) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { isValid, errors } = validator(req.body);
    if (!isValid) {
      return next(ApiError.badRequest("Validation error", errors));
    }
    next();
  };
};
