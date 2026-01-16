# Production deployment for NestJS on Railway
FROM node:18-alpine

WORKDIR /app

# Copy package files from backend directory
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code from backend directory
COPY backend/tsconfig.json ./
COPY backend/nest-cli.json ./
COPY backend/src ./src

# Build the application
RUN npm run build

# Verify build output exists
RUN test -f dist/main.js || (echo "ERROR: dist/main.js not found!" && exit 1)

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "dist/main.js"]