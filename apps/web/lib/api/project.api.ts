import { axiosInstance } from "../axios";
import { getErrorMessage, getValidationErrors } from "./client";
import type { CreateProjectInput, UpdateProjectInput } from "../validations/project.schema";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  tasks: {
    id: string;
    projectId: string;
    title: string;
    status: "OPEN" | "IN_PROGRESS" | "DONE";
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface ProjectListResponse {
  data: Project[];
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProjectResponse {
  data: Project;
  message: string;
}

export interface QueryProjectsParams {
  page?: number;
  limit?: number;
  name?: string;
}

/**
 * Get all projects
 */
export const getProjectsApi = async (
  params?: QueryProjectsParams
): Promise<ProjectListResponse> => {
  try {
    const response = await axiosInstance.get<ProjectListResponse>("/projects", {
      params,
    });
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

/**
 * Get a single project by ID
 */
export const getProjectApi = async (id: string): Promise<ProjectResponse> => {
  try {
    const response = await axiosInstance.get<ProjectResponse>(`/projects/${id}`);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

/**
 * Create a new project
 */
export const createProjectApi = async (
  data: CreateProjectInput
): Promise<ProjectResponse> => {
  try {
    const response = await axiosInstance.post<ProjectResponse>("/projects", data);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    const validationErrors = getValidationErrors(error);
    throw new Error(
      validationErrors.name?.[0] ||
        validationErrors.description?.[0] ||
        message
    );
  }
};

/**
 * Update a project
 */
export const updateProjectApi = async (
  id: string,
  data: UpdateProjectInput
): Promise<ProjectResponse> => {
  try {
    const response = await axiosInstance.put<ProjectResponse>(
      `/projects/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    const validationErrors = getValidationErrors(error);
    throw new Error(
      validationErrors.name?.[0] ||
        validationErrors.description?.[0] ||
        message
    );
  }
};

/**
 * Delete a project
 */
export const deleteProjectApi = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/projects/${id}`);
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

