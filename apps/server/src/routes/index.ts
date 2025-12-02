import { Router } from "express";
import authRoutes from "@/features/auth/auth.routes";
import projectRoutes from "@/features/project/project.routes";

const router: Router = Router();

router.use("/", authRoutes);
router.use("/projects", projectRoutes);

export default router;
