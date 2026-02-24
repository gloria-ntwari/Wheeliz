FROM node:20-slim

# Install OpenSSL and required libraries for Prisma
RUN apt-get update && \
    apt-get install -y openssl libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy Prisma schema & migrations (your actual location)
COPY models ./models

# Generate Prisma Client
RUN npx prisma generate --schema=models/schema.prisma

# Copy the rest of the source code
COPY . .

# Build TypeScript → JavaScript (server.ts → dist/)
RUN npm run build

# Remove dev dependencies (optional but recommended)
RUN npm prune --production

# Expose API port (make sure this matches server.ts)
EXPOSE 5000

# Start compiled app
CMD ["npm", "start"]
