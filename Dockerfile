FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose Next.js dev server port
EXPOSE 3000

# Set hostname for Docker networking (required for Next.js)
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Enable file watching in Docker (for hot-reload)
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

# Run Next.js dev server
CMD ["pnpm", "run", "dev"]