import { Request, Response, NextFunction, CookieOptions } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/ApiResponse";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

const isProduction = env.nodeEnv === "production";

const cookieOptionsBase: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

const accessTokenCookieOptions: CookieOptions = {
  ...cookieOptionsBase,
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookieOptionsBase,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /api/auth/signup
   * Register a new user account.
   */
  public signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.authService.signup(req.body);

      res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);
      res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);

      ApiResponse.success(res, 201, "User registered successfully", {
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Alias for signup method
   */
  public register = this.signup;

  /**
   * POST /api/auth/login
   * Authenticate user credentials.
   */
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);

      res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);
      res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);

      ApiResponse.success(res, 200, "User logged in successfully", {
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/refresh
   * Refresh JWT access token using httpOnly refresh cookie.
   */
  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!refreshToken) {
        throw ApiError.unauthorized("Refresh token is required.");
      }

      const result = await this.authService.refreshToken(refreshToken);

      res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);

      ApiResponse.success(res, 200, "Access token refreshed successfully");
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/auth/me
   * Retrieve current authenticated user profile.
   */
  public getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.userId) {
        throw ApiError.unauthorized("Authentication required.");
      }

      const user = await this.authService.getMe(req.user.userId);
      ApiResponse.success(res, 200, "Current user fetched successfully", { user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/logout
   * Clear authentication cookies.
   */
  public logout = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.clearCookie("accessToken", cookieOptionsBase);
      res.clearCookie("refreshToken", cookieOptionsBase);

      ApiResponse.success(res, 200, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  };
}
