import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiResponse } from "@/lib/response";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return ApiResponse.badRequest(
          res,
          "Validation error",
          "Validation Error",
          error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          }))
        );
      }
      return ApiResponse.internalServerError(res);
    }
  };
};

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return ApiResponse.badRequest(
          res,
          "Validation error",
          "Validation Error",
          error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          }))
        );
      }
      return ApiResponse.internalServerError(res);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return ApiResponse.badRequest(
          res,
          "Validation error",
          "Validation Error",
          error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          }))
        );
      }
      return ApiResponse.internalServerError(res);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return ApiResponse.badRequest(
          res,
          "Validation error",
          "Validation Error",
          error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          }))
        );
      }
      return ApiResponse.internalServerError(res);
    }
  };
};
