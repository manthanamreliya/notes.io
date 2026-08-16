import { RegisterDTO, LoginDTO } from "../types/dtos/auth.dto";

export class AuthValidator {
  /**
   * Validate user registration/signup request body.
   */
  public static validateSignup(data: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const body = data as Partial<RegisterDTO>;

    if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
      errors.push("Name is required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || typeof body.email !== "string" || !emailRegex.test(body.email.trim())) {
      errors.push("Valid email address is required.");
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!body.mobileNumber || typeof body.mobileNumber !== "string" || !mobileRegex.test(body.mobileNumber.trim())) {
      errors.push("Mobile number must be a valid 10-digit number.");
    }

    if (!body.password || typeof body.password !== "string" || body.password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Alias for register validation
   */
  public static validateRegister = AuthValidator.validateSignup;

  /**
   * Validate user login request body.
   */
  public static validateLogin(data: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const body = data as Partial<LoginDTO>;

    if (!body.email || typeof body.email !== "string" || body.email.trim().length === 0) {
      errors.push("Email is required.");
    }

    if (!body.password || typeof body.password !== "string" || body.password.length === 0) {
      errors.push("Password is required.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
