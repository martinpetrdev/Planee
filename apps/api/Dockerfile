# Prune the monorepo using Turborepo
FROM node:26-alpine AS pruner

WORKDIR /app
RUN npm install -g turbo
COPY . .

# Extracts only deps and source files needed for api
RUN turbo prune @repo/api --out-dir=out --docker

# Install dependencies
FROM node:26-alpine AS installer

WORKDIR /app
ENV CI=true

RUN npm i -g pnpm@11

# Copy only pruned lockfile and package.json
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Build
FROM node:26-alpine AS builder

WORKDIR /app
ENV CI=true

RUN npm i -g pnpm@11

# Copy node_modules and dependencies structure 
COPY --from=installer /app ./
# Copy pruned source files
COPY --from=pruner /app/out/full/ ./

# Generate Prisma database schemas
RUN pnpm turbo run generate

# Build
RUN pnpm turbo run build --filter=@repo/api

# Deploy api package into a self-contained directory with production dependencies
RUN pnpm --filter=@repo/api --prod deploy /app/pruned --legacy

# Copy the compiled dist files into the pruned deployment folder
RUN cp -r apps/api/dist /app/pruned/dist

# Production runner
FROM node:26-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy self-contained pruned app
COPY --from=builder /app/pruned /app

EXPOSE 3000

CMD ["node", "dist/main.js"]
