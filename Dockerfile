# Stage 1: Build the frontend static assets
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root and workspace manifests
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install all dependencies (including devDependencies needed for Vite build)
RUN npm ci

# Copy full source tree
COPY . .

# Build the frontend Vite application
RUN npm run build --workspace frontend

# Stage 2: Production runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Copy manifests to install production dependencies only
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN npm ci --omit=dev

# Copy backend source code
COPY backend/src ./backend/src

# Copy built frontend assets from builder stage
COPY --from=builder /app/frontend/dist ./frontend/dist

# Use non-root node user for security
USER node

EXPOSE 4000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:${PORT}/health || exit 1

# Start the application server
CMD ["node", "backend/src/server.js"]

