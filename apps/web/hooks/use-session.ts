"use client";

import { authClient } from "@/lib/auth-client";

/**
 * Custom hook for getting current session
 * Uses better-auth client for session management
 */
export function useSession() {
  const { data: session, isPending, ...rest } = authClient.useSession();

  return {
    data: session,
    user: session?.user,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    ...rest,
  };
}
