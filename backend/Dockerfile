FROM node:18-alpine

WORKDIR /app

# Copy all files (Railway root directory is already set to /backend)
COPY . .

# Install dependencies and build
RUN npm ci && npm run build

# Verify build output exists
RUN test -f dist/main.js || (echo "ERROR: dist/main.js not found!" && exit 1)

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]