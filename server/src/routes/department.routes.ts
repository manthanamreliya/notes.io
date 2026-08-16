import { Router } from "express";
import { DepartmentController } from "../controllers/department.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/role.middleware";

const departmentRouter = Router();
const departmentController = new DepartmentController();

// TODO: Endpoint - Get all departments (GET /api/v1/departments) [Public or Authenticated]
departmentRouter.get("/", departmentController.getDepartments);

// TODO: Endpoint - Create a new department (POST /api/v1/departments) [Admin only]
departmentRouter.post(
  "/",
  authenticate,
  isAdmin,
  departmentController.createDepartment
);

// TODO: Endpoint - Delete department (DELETE /api/v1/departments/:id) [Admin only]
departmentRouter.delete(
  "/:id",
  authenticate,
  isAdmin,
  departmentController.deleteDepartment
);

export default departmentRouter;
