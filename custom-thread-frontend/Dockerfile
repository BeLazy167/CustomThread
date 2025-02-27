# Use Node.js image to build the React app
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./ 
RUN npm install

# Copy all files and build the app
COPY . ./ 
RUN npm run build

# Use Nginx to serve the React app on port 3000
FROM nginx:alpine

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the built React app from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration to set it to listen on port 3000
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 3000 for React app
EXPOSE 3000

# Start Nginx in the foreground (already runs on port 3000 due to config)
CMD ["nginx", "-g", "daemon off;"]
