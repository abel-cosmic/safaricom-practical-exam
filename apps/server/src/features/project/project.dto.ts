import { z } from "zod";
import { TaskStatus } from "@prisma/client";

export const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(200, "Name must be less than 200 characters"),
    description: z
      .string()
      .max(1000, "Description must be less than 1000 characters")
      .optional(),
  }),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>["body"];

export const updateProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(200, "Name must be less than 200 characters")
      .optional(),
    description: z
      .string()
      .max(1000, "Description must be less than 1000 characters")
      .optional()
      .nullable(),
  }),
});

export type UpdateProjectDto = z.infer<typeof updateProjectSchema>["body"];

export const queryProjectsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
    name: z.string().optional(),
  }),
});

export type QueryProjectsDto = z.infer<typeof queryProjectsSchema>["query"];
export interface ProjectWithTasks {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  tasks: {
    id: string;
    projectId: string;
    title: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export interface ProjectListResponse {
  projects: ProjectWithTasks[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
