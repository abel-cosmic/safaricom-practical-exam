import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role?: string | null;
  };
  session?: {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: string | null;
    };
  };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        banned: true,
        banExpires: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (user.banned) {
      const now = new Date();
      if (!user.banExpires || user.banExpires > now) {
        return res
          .status(403)
          .json({ error: "You have been banned from this application" });
      }
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
    };
    req.session = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      },
    };
    next();
  } catch (error) {
    logger.error("Error in auth middleware:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const requireRole = (roles: string | string[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userRole = req.user.role || "user";
    const userRoles = userRole.split(",").map((r) => r.trim());

    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

export const requirePermission = (resource: string, actions: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const hasPermission = await auth.api.userHasPermission({
        body: {
          userId: req.user.id,
          permissions: {
            [resource]: actions,
          },
        },
        headers: fromNodeHeaders(req.headers),
      });

      if (!hasPermission) {
        return res
          .status(403)
          .json({ error: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (error) {
      logger.error("Error checking permissions:", error);
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }
  };
};
