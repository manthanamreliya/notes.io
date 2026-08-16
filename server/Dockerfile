# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies required for compilation)
RUN npm ci

# Copy source code and configuration
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript to JavaScript (outputs to /app/dist)
RUN npm run build

# Production Stage
FROM node:20-alpine AS production

WORKDIR /app

# Install curl for healthcheck execution
RUN apk add --no-cache curl

# Create dedicated non-root group and user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install production-only dependencies
RUN npm ci --omit=dev

# Copy compiled dist directory from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership of application directory to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose backend server port
EXPOSE 5000

# Healthcheck targeting existing backend health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start production server
CMD ["node", "dist/server.js"]
