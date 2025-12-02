import { auth } from "@/auth";
import logger from "@/lib/logger";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT || 3005;
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.all("/api/auth/*", toNodeHandler(auth));
app.use(express.json());
app.listen(port, () => {
  logger.info(`🚀 Server listening on port ${port}`);
});
