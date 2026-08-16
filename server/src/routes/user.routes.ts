import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/role.middleware";

const userRouter = Router();
const userController = new UserController();

// All user routes require authentication
userRouter.use(authenticate);

// TODO: Endpoint - Get authenticated user profile (GET /api/v1/users/me)
userRouter.get("/me", userController.getProfile);

// TODO: Endpoint - List users list with pagination (GET /api/v1/users) [Admin only]
userRouter.get("/", isAdmin, userController.listUsers);

export default userRouter;
