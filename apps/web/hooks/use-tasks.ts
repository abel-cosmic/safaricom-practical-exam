"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasksApi,
  getTaskApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  type QueryTasksParams,
} from "@/lib/api/task.api";
import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "@/lib/validations/task.schema";

/**
 * Query key factory for tasks
 */
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (params?: QueryTasksParams) => [...taskKeys.lists(), params] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

/**
 * Hook to fetch all tasks
 */
export function useTasks(params?: QueryTasksParams) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => getTasksApi(params),
  });
}

/**
 * Hook to fetch a single task
 */
export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTaskApi(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => createTaskApi(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      // Invalidate tasks for the specific project
      if (variables.projectId) {
        queryClient.invalidateQueries({
          queryKey: taskKeys.list({ projectId: variables.projectId }),
        });
      }
    },
  });
}

/**
 * Hook to update a task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      updateTaskApi(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.id),
      });
    },
  });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTaskApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
