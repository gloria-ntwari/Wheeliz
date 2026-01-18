FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Build TypeScript to JavaScript so Node can run it without ts-node
RUN npx tsc

# Expose the API port
EXPOSE 5000

# Run the compiled JavaScript entrypoint
CMD ["node", "dist/server.js"]
