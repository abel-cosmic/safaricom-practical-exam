import { axiosInstance } from "../axios";
import { getErrorMessage, getValidationErrors } from "./client";
import type { CreateTaskInput, UpdateTaskInput } from "../validations/task.schema";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE";
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
  };
}

export interface TaskListResponse {
  data: Task[];
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TaskResponse {
  data: Task;
  message: string;
}

export interface QueryTasksParams {
  page?: number;
  limit?: number;
  projectId?: string;
  status?: "OPEN" | "IN_PROGRESS" | "DONE";
  title?: string;
}

/**
 * Get all tasks
 */
export const getTasksApi = async (
  params?: QueryTasksParams
): Promise<TaskListResponse> => {
  try {
    const response = await axiosInstance.get<TaskListResponse>("/tasks", {
      params,
    });
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

/**
 * Get a single task by ID
 */
export const getTaskApi = async (id: string): Promise<TaskResponse> => {
  try {
    const response = await axiosInstance.get<TaskResponse>(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

/**
 * Create a new task
 */
export const createTaskApi = async (
  data: CreateTaskInput
): Promise<TaskResponse> => {
  try {
    const response = await axiosInstance.post<TaskResponse>("/tasks", data);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    const validationErrors = getValidationErrors(error);
    throw new Error(
      validationErrors.title?.[0] ||
        validationErrors.projectId?.[0] ||
        validationErrors.status?.[0] ||
        message
    );
  }
};

/**
 * Update a task
 */
export const updateTaskApi = async (
  id: string,
  data: UpdateTaskInput
): Promise<TaskResponse> => {
  try {
    const response = await axiosInstance.put<TaskResponse>(
      `/tasks/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    const validationErrors = getValidationErrors(error);
    throw new Error(
      validationErrors.title?.[0] ||
        validationErrors.status?.[0] ||
        message
    );
  }
};

/**
 * Delete a task
 */
export const deleteTaskApi = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/tasks/${id}`);
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

