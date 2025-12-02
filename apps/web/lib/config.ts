/**
 * Application configuration
 * Centralized configuration using environment variables
 */

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api",
    authUrl: process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL.replace("/api", "")}/api/auth`
      : "http://localhost:3005/api/auth",
  },
} as const;

