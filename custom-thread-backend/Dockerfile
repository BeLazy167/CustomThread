# Use multi-stage build to reduce image size
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy only package files first for better layer caching
COPY package*.json ./

# Install dependencies with clean npm cache in the same layer
RUN npm ci --only=production && \
    npm cache clean --force

# Copy the source code to the working directory
COPY . .

# Clean dist directory if it exists
RUN rm -rf dist || true

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Verify build was successful
RUN test -d dist && test -f dist/index.js || (echo "Build failed! dist/index.js missing" && exit 1)

# Expose the port the app runs on
EXPOSE 3001

# Set Node.js to run in production mode
ENV NODE_ENV=production

# Run with reduced logging
CMD [ "node", "--max-old-space-size=512", "dist/index.js" ]
