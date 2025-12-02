import { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SuccessResponse<T> {
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface ErrorResponse {
  message: string;
  error: string;
  details?: Array<{
    path: string;
    message: string;
  }>;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200,
    pagination?: PaginationMeta
  ): Response {
    const response: SuccessResponse<T> = {
      message,
      data,
    };

    if (pagination) {
      response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: string,
    message: string = "Error",
    statusCode: number = 500,
    details?: Array<{ path: string; message: string }>
  ): Response {
    const response: ErrorResponse = {
      message,
      error,
    };

    if (details && details.length > 0) {
      response.details = details;
    }

    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = "Resource created successfully"
  ): Response {
    return this.success(res, data, message, 201);
  }

  static notFound(
    res: Response,
    error: string = "Resource not found",
    message: string = "Not Found"
  ): Response {
    return this.error(res, error, message, 404);
  }

  static unauthorized(
    res: Response,
    error: string = "Unauthorized",
    message: string = "Unauthorized"
  ): Response {
    return this.error(res, error, message, 401);
  }

  static forbidden(
    res: Response,
    error: string = "Forbidden",
    message: string = "Forbidden"
  ): Response {
    return this.error(res, error, message, 403);
  }

  static badRequest(
    res: Response,
    error: string = "Bad Request",
    message: string = "Bad Request",
    details?: Array<{ path: string; message: string }>
  ): Response {
    return this.error(res, error, message, 400, details);
  }

  static internalServerError(
    res: Response,
    error: string = "Internal server error",
    message: string = "Internal Server Error"
  ): Response {
    return this.error(res, error, message, 500);
  }
}
