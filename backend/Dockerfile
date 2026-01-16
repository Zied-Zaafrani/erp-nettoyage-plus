FROM node:18-alpine

WORKDIR /app

# Copy all files (Railway root directory is already set to /backend)
COPY . .

# Install dependencies
RUN npm ci

# Debug: List files before build
RUN echo "=== Files before build ===" && ls -la

# Build the application
RUN npm run build

# Debug: List dist folder after build
RUN echo "=== Checking dist folder ===" && ls -la dist/ || echo "dist folder not found!"

# Verify build output exists
RUN test -f dist/main.js || (echo "ERROR: dist/main.js not found!" && exit 1)

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]