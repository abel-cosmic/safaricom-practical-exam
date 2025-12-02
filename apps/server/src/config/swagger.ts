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
      Post: {
        type: "object",
        required: [
          "id",
          "title",
          "content",
          "published",
          "authorId",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the post",
          },
          title: {
            type: "string",
            description: "Title of the post",
            maxLength: 200,
          },
          content: {
            type: "string",
            description: "Content of the post",
            maxLength: 10000,
          },
          published: {
            type: "boolean",
            description: "Whether the post is published",
            default: false,
          },
          authorId: {
            type: "string",
            description: "ID of the post author",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Post creation timestamp",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Post last update timestamp",
          },
        },
      },
      PostWithAuthor: {
        allOf: [
          { $ref: "#/components/schemas/Post" },
          {
            type: "object",
            properties: {
              author: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string", nullable: true },
                  email: { type: "string" },
                  image: { type: "string", nullable: true },
                },
              },
            },
          },
        ],
      },
      CreatePostRequest: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: {
            type: "string",
            minLength: 1,
            maxLength: 200,
            example: "My First Post",
          },
          content: {
            type: "string",
            minLength: 1,
            maxLength: 10000,
            example: "This is the content of my post.",
          },
          published: {
            type: "boolean",
            default: false,
            example: false,
          },
        },
      },
      UpdatePostRequest: {
        type: "object",
        properties: {
          title: {
            type: "string",
            minLength: 1,
            maxLength: 200,
            example: "Updated Post Title",
          },
          content: {
            type: "string",
            minLength: 1,
            maxLength: 10000,
            example: "Updated content",
          },
          published: {
            type: "boolean",
            example: true,
          },
        },
      },
      PostListResponse: {
        type: "object",
        properties: {
          posts: {
            type: "array",
            items: { $ref: "#/components/schemas/PostWithAuthor" },
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
    },
  },
  tags: [
    {
      name: "Posts",
      description: "Post management endpoints",
    },
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/features/**/*.routes.ts", "./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
