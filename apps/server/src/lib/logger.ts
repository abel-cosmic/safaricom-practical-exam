import winston from "winston";
import chalk from "chalk";
import { mkdirSync } from "fs";
if (process.env.NODE_ENV === "production") {
  try {
    mkdirSync("logs", { recursive: true });
  } catch (error) {
    console.error(error);
  }
}

const methodColors: Record<string, (text: string) => string> = {
  GET: chalk.cyan,
  POST: chalk.green,
  PUT: chalk.yellow,
  PATCH: chalk.magenta,
  DELETE: chalk.red,
  OPTIONS: chalk.gray,
  HEAD: chalk.blue,
};

const getStatusColor = (status: number): ((text: string) => string) => {
  if (status >= 200 && status < 300) return chalk.green;
  if (status >= 300 && status < 400) return chalk.yellow;
  if (status >= 400 && status < 500) return chalk.red;
  if (status >= 500) return chalk.redBright;
  return chalk.white;
};

const formatDuration = (ms: number): string => {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const elysiaFormat = winston.format.printf((info) => {
  const { level, message, timestamp, method, url, status, duration, ...meta } =
    info as any;
  const time = timestamp
    ? chalk.gray(`[${new Date(timestamp as string).toLocaleTimeString()}]`)
    : "";

  if (method && typeof method === "string" && url !== undefined) {
    const methodStr = method as string;
    const methodColor = methodColors[methodStr] || chalk.white;
    const methodDisplay = methodColor(methodStr.padEnd(7));
    const urlDisplay = chalk.white(String(url));

    if (status !== undefined && typeof status === "number") {
      const statusColor = getStatusColor(status);
      const statusDisplay = statusColor(status.toString());
      const durationDisplay =
        duration !== undefined && typeof duration === "number"
          ? chalk.gray(`(${formatDuration(duration)})`)
          : "";
      return `${time} ${methodDisplay} ${urlDisplay} ${statusDisplay} ${durationDisplay}`;
    }

    return `${time} ${methodDisplay} ${urlDisplay}`;
  }

  let levelDisplay: string;
  switch (level) {
    case "error":
      levelDisplay = chalk.redBright("ERROR");
      break;
    case "warn":
      levelDisplay = chalk.yellow("WARN ");
      break;
    case "info":
      levelDisplay = chalk.blue("INFO ");
      break;
    case "debug":
      levelDisplay = chalk.gray("DEBUG");
      break;
    default:
      levelDisplay = chalk.white(level.toUpperCase().padEnd(5));
  }

  const metaString =
    Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
  return `${time} ${levelDisplay} ${message}${metaString}`;
});

export const logger = winston.createLogger({
  level:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === "production" ? "info" : "debug"),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === "production" ? winston.format.json() : elysiaFormat
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),

    ...(process.env.NODE_ENV === "production"
      ? [
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.errors({ stack: true }),
              winston.format.json()
            ),
          }),
          new winston.transports.File({
            filename: "logs/combined.log",
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.errors({ stack: true }),
              winston.format.json()
            ),
          }),
        ]
      : []),
  ],
});

export const logRequest = (
  method: string,
  url: string,
  status: number,
  duration?: number
) => {
  logger.info("", {
    method: method.toUpperCase(),
    url,
    status,
    duration,
  });
};

export const logIncomingRequest = (method: string, url: string) => {
  logger.debug("", {
    method: method.toUpperCase(),
    url,
  });
};
  
export default {
  error: (message: string, ...meta: any[]) => logger.error(message, ...meta),
  warn: (message: string, ...meta: any[]) => logger.warn(message, ...meta),
  info: (message: string, ...meta: any[]) => logger.info(message, ...meta),
  debug: (message: string, ...meta: any[]) => logger.debug(message, ...meta),
  http: logRequest,
  request: logIncomingRequest,
};
