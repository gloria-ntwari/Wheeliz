FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the backend source code (including Prisma schema)
COPY . .

# Generate Prisma client so @prisma/client is ready at runtime
RUN npx prisma generate

# Build TypeScript to JavaScript so Node can run it without ts-node
RUN npx tsc server.ts --module commonjs --outDir dist

# Expose the API port
EXPOSE 5000

# Run the compiled JavaScript entrypoint
CMD ["node", "dist/server.js"]
