import { Router } from "express";
import userRoutes from "./user.routes";
import departmentRoutes from "./department.routes";
import noteRoutes from "./note.routes";

const rootRouter = Router();

// Mount API v1 sub-routers
rootRouter.use("/users", userRoutes);
rootRouter.use("/departments", departmentRoutes);
rootRouter.use("/notes", noteRoutes);

export default rootRouter;
