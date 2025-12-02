import { Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@/auth";
import { AuthRequest } from "@/middleware/auth.middleware";
import logger from "@/lib/logger";

export class AuthController {
  async getMe(req: AuthRequest, res: Response) {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      return res.json(session);
    } catch (error) {
      logger.error("Error getting session:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export const authController = new AuthController();
