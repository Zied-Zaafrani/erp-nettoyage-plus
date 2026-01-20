FROM node:18-alpine

WORKDIR /app

# Copy all files (Railway root directory is already set to /backend)
COPY . .

# Install ALL dependencies including devDependencies (needed for build)
RUN npm ci

# Build the application
RUN npm run build

# Verify build output exists (NestJS outputs to dist/src/main.js)
RUN test -f dist/src/main.js || (echo "ERROR: dist/src/main.js not found!" && ls -laR dist/ && exit 1)

# Expose port
EXPOSE 3000

# Start the application (main.js is in dist/src/)
CMD ["node", "dist/src/main.js"]