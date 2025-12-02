import { Router } from "express";
import authRoutes from "@/features/auth/auth.routes";

const router: Router = Router();

router.use("/", authRoutes);

export default router;
