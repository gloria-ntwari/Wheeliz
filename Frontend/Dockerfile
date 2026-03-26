# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# Accept the backend API URL at build time (Vite embeds it into the JS bundle)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source code and build
COPY . .
RUN npm run build

# ─── Stage 2: Serve with Nginx ────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Install gettext so envsubst is available
RUN apk add --no-cache gettext

# Remove the default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config as a template
COPY nginx.conf /etc/nginx/conf.d/nginx.conf.template

EXPOSE 8080

# At startup: substitute $PORT into the nginx config, then launch nginx
CMD ["/bin/sh", "-c", "export PORT=${PORT:-8080} && envsubst '${PORT}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
