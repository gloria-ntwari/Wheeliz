FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy Prisma schema
COPY models/schema.prisma ./models/
COPY prisma ./prisma/ 2>/dev/null || true

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the backend source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose the API port
EXPOSE 5000

# Run the compiled JavaScript entrypoint
CMD ["npm", "start"]
