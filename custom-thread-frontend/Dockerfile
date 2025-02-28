# Use Node.js image to build the React app
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./ 
RUN npm ci

# Copy all files and build the app
COPY . ./ 
RUN npm run build

# Use Nginx to serve the React app on port 3000
FROM nginx:alpine

# Add nginx user if it doesn't exist
RUN adduser -D -H -u 1000 -s /sbin/nologin nginx || true

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the built React app from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration to set it to listen on port 3000
COPY nginx.conf /etc/nginx/nginx.conf

# Create cache directories and set permissions
RUN mkdir -p /var/cache/nginx /var/run \
    && chown -R nginx:nginx /var/cache/nginx /var/run /usr/share/nginx/html

# Expose port 3000 for React app
EXPOSE 3000

# Switch to non-root user
USER nginx

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
