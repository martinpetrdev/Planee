# Prune the monorepo using Turborepo
FROM node:26-alpine AS pruner

WORKDIR /app
RUN npm install -g turbo
COPY . .

# Extracts only the dependencies and source files needed
RUN turbo prune --scope=@repo/marketing-web --out-dir=out --docker

# Install dependencies
FROM node:26-alpine AS installer

WORKDIR /app
ENV CI=true

RUN npm i -g pnpm@latest-11

# Copy only the pruned lockfile and package.json
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Build 
FROM node:26-alpine AS builder

WORKDIR /app
ENV CI=true

RUN npm i -g pnpm@latest-11

# Copy node_modules and dependencies structure
COPY --from=installer /app ./
# Copy pruned source files
COPY --from=pruner /app/out/full/ ./

RUN pnpm turbo run generate
RUN pnpm turbo run build --filter=@repo/marketing-web

# Production runner
FROM node:26-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/apps/marketing-web/.next/standalone ./
COPY --from=builder /app/apps/marketing-web/.next/static ./apps/marketing-web/.next/static
COPY --from=builder /app/apps/marketing-web/public* ./apps/marketing-web/public

EXPOSE 3000

CMD ["node", "apps/marketing-web/server.js"]
