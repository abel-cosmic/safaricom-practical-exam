import { axiosInstance } from "../axios";
import { getErrorMessage, getValidationErrors } from "./client";
import type {
  SignInInput,
  SignUpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../validations/auth.schema";

/**
 * Auth API response types
 */
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * Sign in API call
 */
export const signInApi = async (data: SignInInput): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/sign-in/email",
      data
    );
    return response.data.data;
  } catch (error) {
    const message = getErrorMessage(error);
    const validationErrors = getValidationErrors(error);
    throw new Error(
      validationErrors.email?.[0] || validationErrors.password?.[0] || message
    );
  }
};

/**
 * Sign up API call
 */
export const signUpApi = async (data: SignUpInput): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/sign-up/email",
      data
    );
    return response.data.data;
  } catch (error) {
    const message = getErrorMessage(error);
    const validationErrors = getValidationErrors(error);
    throw new Error(
      validationErrors.email?.[0] || validationErrors.password?.[0] || message
    );
  }
};

/**
 * Forgot password API call
 */
export const forgotPasswordApi = async (
  data: ForgotPasswordInput
): Promise<void> => {
  try {
    await axiosInstance.post("/auth/forgot-password", data);
  } catch (error) {
    const message = getErrorMessage(error);
    const validationErrors = getValidationErrors(error);
    throw new Error(validationErrors.email?.[0] || message);
  }
};

/**
 * Reset password API call
 */
export const resetPasswordApi = async (
  data: ResetPasswordInput
): Promise<void> => {
  try {
    await axiosInstance.post("/auth/reset-password", {
      token: data.token,
      password: data.password,
    });
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

/**
 * Get current user session
 */
export const getSessionApi = async () => {
  try {
    const response = await axiosInstance.get("/me");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
