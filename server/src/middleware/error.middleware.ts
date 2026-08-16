import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

/**
 * Centralized Express Error Handling Middleware.
 */
export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): Response => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: string[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof Error) {
    message = err.message;
  }

  const response = {
    success: false,
    statusCode,
    message,
    ...(errors.length > 0 && { errors }),
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  };

  console.error(`[Error Handler] ${statusCode} - ${message}`, err.stack);

  return res.status(statusCode).json(response);
};
