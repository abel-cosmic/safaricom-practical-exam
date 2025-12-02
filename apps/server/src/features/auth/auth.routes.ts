import { Router } from "express";
import { authController } from "./auth.controller";

const router: Router = Router();

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get current user session
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/me", authController.getMe.bind(authController));

export default router;
