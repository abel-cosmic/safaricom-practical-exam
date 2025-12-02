import { AxiosError } from "axios";
import { axiosInstance } from "../axios";

/**
 * API Error response type
 */
export interface ApiError {
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * Extract error message from API error
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;
    return (
      apiError?.message ||
      apiError?.error ||
      error.message ||
      "An error occurred"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

/**
 * Extract validation errors from API error
 */
export const getValidationErrors = (
  error: unknown
): Record<string, string[]> => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;
    return apiError?.errors || {};
  }
  return {};
};

export { axiosInstance as apiClient };
