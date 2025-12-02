import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { config } from "./config";

/**
 * Axios instance with base configuration
 * Includes credentials for cookie-based authentication
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Can be used to add auth tokens or modify requests
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add any request modifications here
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles common errors and transforms responses
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      if (status === 401) {
        // Unauthorized - session expired or invalid
        // Could trigger logout here if needed
      } else if (status === 403) {
        // Forbidden - user doesn't have permission
      } else if (status >= 500) {
        // Server error
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error:", error.request);
    } else {
      // Error setting up request
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
