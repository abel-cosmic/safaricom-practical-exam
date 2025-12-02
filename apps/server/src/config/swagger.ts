import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Posts API",
    version: "1.0.0",
    description: "A RESTful API for managing posts with authentication",
    contact: {
      name: "API Support",
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3005}`,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "better-auth.session_token",
        description: "Session token from Better Auth",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Error message",
          },
          details: {
            type: "array",
            items: {
              type: "object",
              properties: {
                path: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string" },
          name: { type: "string", nullable: true },
          image: { type: "string", nullable: true },
        },
      },
      Session: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          session: {
            type: "object",
            properties: {
              id: { type: "string" },
              userId: { type: "string" },
              expiresAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
      Project: {
        type: "object",
        required: ["id", "name", "createdAt"],
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the project",
          },
          name: {
            type: "string",
            description: "Name of the project",
            maxLength: 200,
          },
          description: {
            type: "string",
            nullable: true,
            description: "Description of the project",
            maxLength: 1000,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Project creation timestamp",
          },
        },
      },
      Task: {
        type: "object",
        required: [
          "id",
          "projectId",
          "title",
          "status",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the task",
          },
          projectId: {
            type: "string",
            description: "ID of the project this task belongs to",
          },
          title: {
            type: "string",
            description: "Title of the task",
          },
          status: {
            type: "string",
            enum: ["OPEN", "IN_PROGRESS", "DONE"],
            description: "Status of the task",
            default: "OPEN",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Task creation timestamp",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Task last update timestamp",
          },
        },
      },
      ProjectWithTasks: {
        allOf: [
          { $ref: "#/components/schemas/Project" },
          {
            type: "object",
            properties: {
              tasks: {
                type: "array",
                items: { $ref: "#/components/schemas/Task" },
              },
            },
          },
        ],
      },
      CreateProjectRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 200,
            example: "My Project",
          },
          description: {
            type: "string",
            maxLength: 1000,
            example: "This is a project description.",
          },
        },
      },
      UpdateProjectRequest: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 200,
            example: "Updated Project Name",
          },
          description: {
            type: "string",
            nullable: true,
            maxLength: 1000,
            example: "Updated project description",
          },
        },
      },
      ProjectListResponse: {
        type: "object",
        properties: {
          projects: {
            type: "array",
            items: { $ref: "#/components/schemas/ProjectWithTasks" },
          },
          pagination: {
            type: "object",
            properties: {
              page: { type: "number" },
              limit: { type: "number" },
              total: { type: "number" },
              totalPages: { type: "number" },
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
    {
      name: "Projects",
      description: "Project management endpoints",
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/features/**/*.routes.ts", "./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
