# Use official Node.js image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the API port
EXPOSE 5000

# Start the server with ts-node
CMD ["npx", "ts-node", "server.ts"]
