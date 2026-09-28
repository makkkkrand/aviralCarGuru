# syntax=docker/dockerfile:1

# ----------------------------------------------------------------------------
# Stage 1: Build Frontend Assets
# ----------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy OpenAPI spec and frontend manifests
COPY contracts /contracts
COPY frontend/package*.json ./

RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Run code generator and build production bundle
RUN npm run api:generate && npm run build

# ----------------------------------------------------------------------------
# Stage 2: Serve with Lightweight Nginx Alpine
# ----------------------------------------------------------------------------
FROM nginx:alpine AS runner

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
