import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateBody } from "../middleware/validate.middleware";
import { AuthValidator } from "../validators/auth.validator";
import { authenticate } from "../middleware/auth.middleware";

const authRouter = Router();
const authController = new AuthController();

/**
 * POST /api/auth/signup (User Registration)
 */
authRouter.post(
  "/signup",
  validateBody(AuthValidator.validateSignup),
  authController.signup
);

/**
 * POST /api/auth/login (User Authentication)
 */
authRouter.post(
  "/login",
  validateBody(AuthValidator.validateLogin),
  authController.login
);

/**
 * POST /api/auth/refresh (Refresh Access Token)
 */
authRouter.post("/refresh", authController.refreshToken);

/**
 * GET /api/auth/me (Current Authenticated User Profile)
 */
authRouter.get("/me", authenticate, authController.getMe);

/**
 * POST /api/auth/logout (Clear Auth Cookies)
 */
authRouter.post("/logout", authController.logout);

export default authRouter;
