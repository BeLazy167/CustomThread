# Use Node.js image to build the React app
FROM node:18 as build

# Set working directory
WORKDIR /app

# Define build arguments for environment variables
ARG VITE_API_URL
ARG VITE_ENVIRONMENT
ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_CLOUDINARY_API_KEY
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_STRIPE_PUBLISHABLE_KEY

# Set environment variables from build args
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_ENVIRONMENT=${VITE_ENVIRONMENT}
ENV VITE_CLOUDINARY_CLOUD_NAME=${VITE_CLOUDINARY_CLOUD_NAME}
ENV VITE_CLOUDINARY_API_KEY=${VITE_CLOUDINARY_API_KEY}
ENV VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}
ENV VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./ 
RUN npm i

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

# Ensure the assets directory exists
RUN mkdir -p /usr/share/nginx/html/assets

# Copy assets from the build stage
COPY --from=build /app/public/assets /usr/share/nginx/html/assets

# Copy a custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create a script to replace environment variables at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo 'envsubst < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.sh && \
    echo 'exec "$@"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Create a template file for runtime environment variables
RUN echo "window.ENV = {" > /usr/share/nginx/html/env-config.js.template && \
    echo "  VITE_API_URL: '${VITE_API_URL}'," >> /usr/share/nginx/html/env-config.js.template && \
    echo "  VITE_ENVIRONMENT: '${VITE_ENVIRONMENT}'," >> /usr/share/nginx/html/env-config.js.template && \
    echo "  VITE_CLOUDINARY_CLOUD_NAME: '${VITE_CLOUDINARY_CLOUD_NAME}'," >> /usr/share/nginx/html/env-config.js.template && \
    echo "  VITE_CLOUDINARY_API_KEY: '${VITE_CLOUDINARY_API_KEY}'," >> /usr/share/nginx/html/env-config.js.template && \
    echo "  VITE_CLERK_PUBLISHABLE_KEY: '${VITE_CLERK_PUBLISHABLE_KEY}'," >> /usr/share/nginx/html/env-config.js.template && \
    echo "  VITE_STRIPE_PUBLISHABLE_KEY: '${VITE_STRIPE_PUBLISHABLE_KEY}'," >> /usr/share/nginx/html/env-config.js.template && \
    echo "};" >> /usr/share/nginx/html/env-config.js.template

# Create cache directories and set permissions
RUN mkdir -p /var/cache/nginx /var/run \
    && chown -R nginx:nginx /var/cache/nginx /var/run /usr/share/nginx/html /docker-entrypoint.sh

# Expose port 3000 for React app
EXPOSE 3000

# Switch to non-root user
USER nginx

# Start Nginx with the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
