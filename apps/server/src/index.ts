import "dotenv/config";
import express from "express";
import cors from "cors";
import { apiReference } from "@scalar/express-api-reference";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/auth";
import { getMergedOpenAPISpec } from "@/config/openapi-merger";
import logger from "@/lib/logger";
import { requestLogger } from "@/middleware/logger.middleware";
import routes from "@/routes";
const app = express();
const port = process.env.PORT || 3005;
app.use(requestLogger);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.all("/api/auth/*", toNodeHandler(auth));
app.use(express.json());
app.get("/openapi-merged.json", async (req, res) => {
  try {
    const mergedSpec = await getMergedOpenAPISpec();
    res.setHeader("Content-Type", "application/json");
    res.send(mergedSpec);
  } catch (error) {
    logger.error("Error generating merged OpenAPI schema:", error);
    res.status(500).json({ error: "Failed to generate merged OpenAPI schema" });
  }
});
app.use(
  "/docs",
  apiReference({
    pageTitle: "API Documentation",
    theme: "bluePlanet",
    layout: "modern",
    //@ts-ignore
    spec: {
      url: "/openapi-merged.json",
    },
    configuration: {
      theme: "bluePlanet",
    },
  })
);
app.use("/api", routes);
app.listen(port, () => {
  logger.info(`🚀 Server listening on port ${port}`);
  logger.info(`📚 Scalar docs available at http://localhost:${port}/docs`);
});
