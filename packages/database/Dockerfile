FROM node:26-alpine

WORKDIR /app
ENV CI=true

RUN npm i -g pnpm@11

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy database package 
COPY packages/database ./packages/database

# Install only the dependencies required
RUN pnpm install --filter=@repo/database --frozen-lockfile

WORKDIR /app/packages/database

# Run the prisma migrations deploy command on startup
CMD ["npx", "prisma", "migrate", "deploy"]
