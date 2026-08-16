import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/role.middleware";

const adminUserRouter = Router();
const userController = new UserController();

// GET /api/admin/users (Admin only)
adminUserRouter.get("/", authenticate, isAdmin, userController.listUsers);

export default adminUserRouter;
