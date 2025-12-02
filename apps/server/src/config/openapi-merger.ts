import { auth } from "@/auth";
import { swaggerSpec } from "./swagger";

export async function getMergedOpenAPISpec() {
  // Get Better Auth OpenAPI schema
  const betterAuthSchema = (await auth.api.generateOpenAPISchema()) as any;
  const mainSpec = swaggerSpec as any;

  // Merge the schemas
  const merged: any = {
    ...mainSpec,
    info: {
      ...mainSpec.info,
      title: "Posts API with Better Auth",
      description:
        "A RESTful API for managing posts with Better Auth authentication. Includes all Posts API endpoints and Better Auth authentication endpoints.",
    },
    paths: {
      ...(mainSpec.paths || {}),
      ...(betterAuthSchema.paths || {}),
    },
    components: {
      ...mainSpec.components,
      schemas: {
        ...(mainSpec.components?.schemas || {}),
        ...(betterAuthSchema.components?.schemas || {}),
      },
      securitySchemes: {
        ...(mainSpec.components?.securitySchemes || {}),
        ...(betterAuthSchema.components?.securitySchemes || {}),
      },
      parameters: {
        ...(mainSpec.components?.parameters || {}),
        ...(betterAuthSchema.components?.parameters || {}),
      },
      responses: {
        ...(mainSpec.components?.responses || {}),
        ...(betterAuthSchema.components?.responses || {}),
      },
      requestBodies: {
        ...(mainSpec.components?.requestBodies || {}),
        ...(betterAuthSchema.components?.requestBodies || {}),
      },
      headers: {
        ...(mainSpec.components?.headers || {}),
        ...(betterAuthSchema.components?.headers || {}),
      },
      examples: {
        ...(mainSpec.components?.examples || {}),
        ...(betterAuthSchema.components?.examples || {}),
      },
      links: {
        ...(mainSpec.components?.links || {}),
        ...(betterAuthSchema.components?.links || {}),
      },
      callbacks: {
        ...(mainSpec.components?.callbacks || {}),
        ...(betterAuthSchema.components?.callbacks || {}),
      },
    },
    tags: [...(mainSpec.tags || []), ...(betterAuthSchema.tags || [])],
    servers: [...(mainSpec.servers || []), ...(betterAuthSchema.servers || [])],
  };

  // Remove duplicate tags
  if (merged.tags) {
    const uniqueTags = merged.tags.filter(
      (tag: any, index: number, self: any[]) =>
        index === self.findIndex((t: any) => t.name === tag.name)
    );
    merged.tags = uniqueTags;
  }

  // Remove duplicate servers
  if (merged.servers) {
    const uniqueServers = merged.servers.filter(
      (server: any, index: number, self: any[]) =>
        index === self.findIndex((s: any) => s.url === server.url)
    );
    merged.servers = uniqueServers;
  }

  return merged;
}
