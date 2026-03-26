# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Accept the backend API URL at build time (required by Vite to embed it in the bundle)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the production bundle (VITE_API_URL gets embedded here)
RUN npm run build


# ─── Stage 2: Serve with Nginx ────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove the default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Store the nginx conf as a template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Use envsubst to inject $PORT at runtime, then start nginx
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
