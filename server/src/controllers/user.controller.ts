import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * GET /api/v1/users/me
   * Get authenticated user profile.
   */
  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }
      const profile = await this.userService.getUserProfile(req.user.userId);
      ApiResponse.success(res, 200, "User profile retrieved successfully", profile);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/users or GET /api/v1/users
   * List users with page & limit pagination (admin only).
   */
  public listUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const skip = req.query.skip ? Number(req.query.skip) : (page - 1) * limit;
      const users = await this.userService.listUsers(skip, limit);
      ApiResponse.success(res, 200, "Users retrieved successfully", users);
    } catch (error) {
      next(error);
    }
  };
}
