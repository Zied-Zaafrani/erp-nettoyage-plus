# Production deployment for NestJS on Railway
FROM node:18-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies and build
RUN npm ci && npm run build

# Verify build output exists
RUN test -f dist/main.js || (echo "ERROR: dist/main.js not found!" && exit 1)

# List what's in dist for debugging
RUN ls -la dist/

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "dist/main.js"]
