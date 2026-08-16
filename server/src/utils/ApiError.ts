export class ApiError extends Error {
  public statusCode: number;
  public errors: string[];
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: string[] = [],
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public static badRequest(message: string, errors: string[] = []): ApiError {
    return new ApiError(400, message, errors);
  }

  public static unauthorized(message = "Unauthorized access"): ApiError {
    return new ApiError(401, message);
  }

  public static forbidden(message = "Forbidden action"): ApiError {
    return new ApiError(403, message);
  }

  public static notFound(message = "Resource not found"): ApiError {
    return new ApiError(404, message);
  }

  public static conflict(message = "Resource conflict"): ApiError {
    return new ApiError(409, message);
  }

  public static internal(message = "Internal server error"): ApiError {
    return new ApiError(500, message, [], false);
  }
}
