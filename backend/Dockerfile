# Production deployment for NestJS on Railway
FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "dist/main.js"]
