# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
# Copy Prisma files needed for postinstall script
COPY apps/server/prisma ./apps/server/prisma
COPY apps/server/prisma.config.ts ./apps/server/prisma.config.ts
# Accept DATABASE_URL as build argument from local environment
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL:-postgresql://dummy:dummy@localhost:5432/dummy}
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
WORKDIR /app
# Copy package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
# Copy Prisma files needed for build
COPY apps/server/prisma ./apps/server/prisma
COPY apps/server/prisma.config.ts ./apps/server/prisma.config.ts
# Accept DATABASE_URL as build argument from local environment
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL:-postgresql://dummy:dummy@localhost:5432/dummy}
# Install all dependencies (including devDependencies needed for build)
RUN pnpm install --frozen-lockfile
# Copy source code
COPY . .
WORKDIR /app/apps/server
RUN pnpm run build

# Stage 3: Production
FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
WORKDIR /app

# Install Prisma CLI for migrations
RUN npm install -g prisma@^7.0.0

# Copy built application
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./package.json
COPY --from=builder /app/apps/server/prisma ./prisma
COPY --from=builder /app/apps/server/prisma.config.ts ./prisma.config.ts
# Copy node_modules (pnpm hoists dependencies to root)
COPY --from=builder /app/node_modules ./node_modules

# Generate Prisma Client (using the config file)
# Accept DATABASE_URL as build argument from local environment
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL:-postgresql://dummy:dummy@localhost:5432/dummy}
RUN npx prisma generate --schema=./prisma/schema.prisma

# Create startup script for migrations
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'npx prisma migrate deploy --schema=./prisma/schema.prisma' >> /app/start.sh && \
    echo 'node dist/index.js' >> /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 3005

ENV NODE_ENV=production
ENV PORT=3005

CMD ["/app/start.sh"]

