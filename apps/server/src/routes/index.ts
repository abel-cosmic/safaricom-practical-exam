import { Router } from "express";
import authRoutes from "@/features/auth/auth.routes";
import projectRoutes from "@/features/project/project.routes";
import taskRoutes from "@/features/task/task.routes";

const router: Router = Router();

router.use("/", authRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

export default router;
