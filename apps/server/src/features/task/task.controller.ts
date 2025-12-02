import logger from "@/lib/logger";
import { ApiResponse } from "@/lib/response";
import { AuthRequest } from "@/middleware/auth.middleware";
import { Response } from "express";
import { CreateTaskDto, QueryTasksDto, UpdateTaskDto } from "./task.dto";
import { taskService } from "./task.service";

export class TaskController {
  async findAll(req: AuthRequest, res: Response) {
    try {
      const query = req.query as unknown as QueryTasksDto;
      const result = await taskService.findAll(query);

      return ApiResponse.success(
        res,
        result.tasks,
        "Tasks retrieved successfully",
        200,
        result.pagination
      );
    } catch (error) {
      logger.error("Error fetching tasks:", error);
      return ApiResponse.internalServerError(res);
    }
  }

  async findOne(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const task = await taskService.findOne(id as string);

      return ApiResponse.success(res, task, "Task retrieved successfully");
    } catch (error) {
      if (error instanceof Error && error.message === "Task not found") {
        return ApiResponse.notFound(res, error.message);
      }
      logger.error("Error fetching task:", error);
      return ApiResponse.internalServerError(res);
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponse.unauthorized(res);
      }

      const data = req.body as CreateTaskDto;
      const task = await taskService.create(data);

      return ApiResponse.created(res, task, "Task created successfully");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Project not found") {
          return ApiResponse.notFound(res, error.message);
        }
      }
      logger.error("Error creating task:", error);
      return ApiResponse.internalServerError(res);
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponse.unauthorized(res);
      }

      const { id } = req.params;
      const data = req.body as UpdateTaskDto;

      const task = await taskService.update(id as string, data);

      return ApiResponse.success(res, task, "Task updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Task not found") {
          return ApiResponse.notFound(res, error.message);
        }
      }
      logger.error("Error updating task:", error);
      return ApiResponse.internalServerError(res);
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponse.unauthorized(res);
      }

      const { id } = req.params;
      await taskService.delete(id as string);

      return ApiResponse.success(res, null, "Task deleted successfully", 200);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Task not found") {
          return ApiResponse.notFound(res, error.message);
        }
      }
      logger.error("Error deleting task:", error);
      return ApiResponse.internalServerError(res);
    }
  }
}

export const taskController = new TaskController();
