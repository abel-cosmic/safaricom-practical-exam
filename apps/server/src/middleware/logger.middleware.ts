import { Request, Response, NextFunction } from "express";
import { logRequest } from "@/lib/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  const originalEnd = res.end.bind(res);
  res.end = function (
    chunk?: any,
    encoding?: any | undefined,
    cb?: () => void
  ) {
    const duration = Date.now() - startTime;
    const url = req.originalUrl || req.url;

    logRequest(req.method, url, res.statusCode, duration);
    return originalEnd(chunk, encoding, cb);
  };

  next();
};
