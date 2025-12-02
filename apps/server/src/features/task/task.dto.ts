import { z } from "zod";
import { TaskStatus } from "@prisma/client";

export const createTaskSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "Project ID is required"),
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters"),
    status: z.nativeEnum(TaskStatus).optional().default(TaskStatus.OPEN),
  }),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>["body"];

export const updateTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters")
      .optional(),
    status: z.nativeEnum(TaskStatus).optional(),
  }),
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>["body"];

export const queryTasksSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
    projectId: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    title: z.string().optional(),
  }),
});

export type QueryTasksDto = z.infer<typeof queryTasksSchema>["query"];

export interface TaskWithProject {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  project: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
  };
}

export interface TaskListResponse {
  tasks: TaskWithProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
