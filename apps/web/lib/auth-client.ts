import { createAuthClient } from "better-auth/react";
import { config } from "./config";

/**
 * Better Auth client instance
 * Configured to connect to the backend auth API
 */
export const authClient = createAuthClient({
  baseURL: config.api.authUrl,
});

/**
 * Re-export auth client methods for convenience
 */
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  forgotPassword,
  resetPassword,
} = authClient;
