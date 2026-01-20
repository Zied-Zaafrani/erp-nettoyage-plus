FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
COPY backend/ ./

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build

# Verify build output
RUN test -f dist/src/main.js || (echo "ERROR: dist/src/main.js not found!" && ls -laR dist/ && exit 1)

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/main.js"]
