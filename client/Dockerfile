# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Declare build argument for Vite environment variable injection
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application source code and configuration files
COPY tsconfig.json vite.config.ts tailwind.config.ts postcss.config.js index.html ./
COPY src/ ./src/

# Compile frontend static assets (Vite outputs to /app/dist)
RUN npm run build

# Production Stage (Nginx)
FROM nginx:alpine AS production

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA fallback routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx web server port
EXPOSE 80

# Healthcheck targeting Nginx root endpoint on loopback interface
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
