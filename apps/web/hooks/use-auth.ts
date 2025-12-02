"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  signInApi,
  signUpApi,
  forgotPasswordApi,
  resetPasswordApi,
} from "@/lib/api/auth.api";
import type {
  SignInInput,
  SignUpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/lib/validations/auth.schema";

/**
 * Custom hook for authentication operations
 * Integrates better-auth client with TanStack Query
 */
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  /**
   * Sign in mutation
   */
  const signInMutation = useMutation({
    mutationFn: async (data: SignInInput) => {
      // Use better-auth client for sign in
      const result = await authClient.signIn.email(data);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate session query to refetch user data
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/dashboard");
    },
  });

  /**
   * Sign up mutation
   */
  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpInput) => {
      // Use better-auth client for sign up
      const result = await authClient.signUp.email(data);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate session query to refetch user data
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/dashboard");
    },
  });

  /**
   * Sign out mutation
   */
  const signOutMutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: () => {
      // Clear all queries and redirect to sign in
      queryClient.clear();
      router.push("/sign-in");
    },
  });

  /**
   * Forgot password mutation
   */
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      await forgotPasswordApi(data);
    },
  });

  /**
   * Reset password mutation
   */
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      await resetPasswordApi(data);
    },
    onSuccess: () => {
      router.push("/sign-in");
    },
  });

  return {
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    isLoading:
      signInMutation.isPending ||
      signUpMutation.isPending ||
      signOutMutation.isPending ||
      forgotPasswordMutation.isPending ||
      resetPasswordMutation.isPending,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    errors: {
      signIn: signInMutation.error,
      signUp: signUpMutation.error,
      signOut: signOutMutation.error,
      forgotPassword: forgotPasswordMutation.error,
      resetPassword: resetPasswordMutation.error,
    },
  };
}
