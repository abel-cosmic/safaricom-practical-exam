import { Response } from "express";
import { AuthRequest } from "@/middleware/auth.middleware";
import { projectService } from "./project.service";
import {
  CreateProjectDto,
  UpdateProjectDto,
  QueryProjectsDto,
} from "./project.dto";
import logger from "@/lib/logger";
import { ApiResponse } from "@/lib/response";

export class ProjectController {
  async findAll(req: AuthRequest, res: Response) {
    try {
      const query = req.query as unknown as QueryProjectsDto;
      const result = await projectService.findAll(query);

      return ApiResponse.success(
        res,
        result.projects,
        "Projects retrieved successfully",
        200,
        result.pagination
      );
    } catch (error) {
      logger.error("Error fetching projects:", error);
      return ApiResponse.internalServerError(res);
    }
  }

  async findOne(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const project = await projectService.findOne(id as string);

      return ApiResponse.success(
        res,
        project,
        "Project retrieved successfully"
      );
    } catch (error) {
      if (error instanceof Error && error.message === "Project not found") {
        return ApiResponse.notFound(res, error.message);
      }
      logger.error("Error fetching project:", error);
      return ApiResponse.internalServerError(res);
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponse.unauthorized(res);
      }

      const data = req.body as CreateProjectDto;
      const project = await projectService.create(data);

      return ApiResponse.created(res, project, "Project created successfully");
    } catch (error) {
      logger.error("Error creating project:", error);
      return ApiResponse.internalServerError(res);
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponse.unauthorized(res);
      }

      const { id } = req.params;
      const data = req.body as UpdateProjectDto;

      const project = await projectService.update(id as string, data);

      return ApiResponse.success(res, project, "Project updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Project not found") {
          return ApiResponse.notFound(res, error.message);
        }
      }
      logger.error("Error updating project:", error);
      return ApiResponse.internalServerError(res);
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponse.unauthorized(res);
      }

      const { id } = req.params;
      await projectService.delete(id as string);

      return ApiResponse.success(
        res,
        null,
        "Project deleted successfully",
        200
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Project not found") {
          return ApiResponse.notFound(res, error.message);
        }
      }
      logger.error("Error deleting project:", error);
      return ApiResponse.internalServerError(res);
    }
  }
}

export const projectController = new ProjectController();
