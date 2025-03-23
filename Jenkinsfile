pipeline {
    agent any

    environment {
        FRONTEND_DIR = "custom-thread-frontend"
        BACKEND_DIR = "custom-thread-backend"
        BRANCH_NAME = "main"
        DEPLOY_ENV = "${env.BRANCH_NAME == 'main' ? 'qa' : (env.BRANCH_NAME == 'qa' ? 'qa' : 'development')}"
        FRONTEND_IMAGE = "custom-thread-frontend-${DEPLOY_ENV}"
        BACKEND_IMAGE = "custom-thread-backend-${DEPLOY_ENV}"
        FRONTEND_CONTAINER = "frontend-${DEPLOY_ENV}"
        BACKEND_CONTAINER = "backend-${DEPLOY_ENV}"
        FRONTEND_PORT = "3002"
        BACKEND_PORT = "3001"
        DOCKER_NETWORK = "customthread-network-${DEPLOY_ENV}"
    }

    stages {
        stage('Cleanup') {
            steps {
                echo "Cleaning up disk space before build..."
                sh '''
                    docker image prune -f
                    docker volume prune -f
                    docker container prune -f
                    npm cache clean --force || true
                    rm -rf /tmp/npm-* || true
                    find . -name "node_modules" -type d -prune -exec rm -rf {} + || true
                    df -h
                '''
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
                echo "Building branch: ${env.BRANCH_NAME} for ${DEPLOY_ENV} environment"
            }
        }

        stage('Generate Environment Files') {
            steps {
                withCredentials([
                    string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI'),
                    string(credentialsId: 'cloudinary-url', variable: 'CLOUDINARY_URL'),
                    string(credentialsId: 'cloudinary-cloud-name', variable: 'CLOUDINARY_CLOUD_NAME'),
                    string(credentialsId: 'cloudinary-api-key', variable: 'CLOUDINARY_API_KEY'),
                    string(credentialsId: 'cloudinary-api-secret', variable: 'CLOUDINARY_API_SECRET'),
                    string(credentialsId: 'clerk-secret-key', variable: 'CLERK_SECRET_KEY'),
                    string(credentialsId: 'clerk-publishable-key', variable: 'CLERK_PUBLISHABLE_KEY'),
                    string(credentialsId: 'stripe-secret-key', variable: 'STRIPE_SECRET_KEY'),
                    string(credentialsId: 'stripe-publishable-key', variable: 'STRIPE_PUBLISHABLE_KEY'),
                    string(credentialsId: 'webhook-endpoint-secret', variable: 'WEBHOOK_ENDPOINT_SECRET')
                ]) {
                    script {
                        // Generate environment files with correct container naming and network configurations
                        writeFile file: "${FRONTEND_DIR}/.env.${DEPLOY_ENV}", text: """
                            VITE_CLOUDINARY_URL=${CLOUDINARY_URL}
                            VITE_CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
                            VITE_CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
                            VITE_CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
                            VITE_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}
                            VITE_API_URL=http://${BACKEND_CONTAINER}:3001
                            VITE_ENVIRONMENT=${DEPLOY_ENV}
                            VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
                        """

                        writeFile file: "${BACKEND_DIR}/.env.${DEPLOY_ENV}", text: """
                            NODE_ENV=${DEPLOY_ENV}
                            PORT=3001
                            MONGODB_URI=${MONGODB_URI}
                            CORS_ORIGIN=http://${FRONTEND_CONTAINER}:3000,http://localhost:${FRONTEND_PORT},*
                            CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
                            CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
                            CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
                            CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
                            CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}
                            STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
                            STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
                            WEBHOOK_ENDPOINT_SECRET=${WEBHOOK_ENDPOINT_SECRET}
                        """
                    }
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir("${FRONTEND_DIR}") {
                    withCredentials([
                        string(credentialsId: 'cloudinary-cloud-name', variable: 'CLOUDINARY_CLOUD_NAME'),
                        string(credentialsId: 'cloudinary-api-key', variable: 'CLOUDINARY_API_KEY'),
                        string(credentialsId: 'clerk-publishable-key', variable: 'CLERK_PUBLISHABLE_KEY'),
                        string(credentialsId: 'stripe-publishable-key', variable: 'STRIPE_PUBLISHABLE_KEY')
                    ]) {
                        sh "cp .env.${DEPLOY_ENV} .env"
                        sh 'npm i'
                        sh 'npm run build'
                        sh """
                        docker build \\
                            --build-arg VITE_API_URL=http://${BACKEND_CONTAINER}:3001 \\
                            --build-arg VITE_ENVIRONMENT=${DEPLOY_ENV} \\
                            --build-arg VITE_CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME} \\
                            --build-arg VITE_CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY} \\
                            --build-arg VITE_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY} \\
                            --build-arg VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY} \\
                            -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} .
                        """
                        sh "docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest"
                        
                        // Update Nginx configuration to use the backend container name
                        sh """
                        cat > nginx.conf << 'EOF'
worker_processes auto;
pid /tmp/nginx.pid;
events {
    worker_connections 1024;
}
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    # Gzip compression
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_vary on;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/xml
        image/svg+xml;
    # Cache settings
    client_body_temp_path /tmp/client_temp;
    proxy_temp_path /tmp/proxy_temp;
    fastcgi_temp_path /tmp/fastcgi_temp;
    uwsgi_temp_path /tmp/uwsgi_temp;
    scgi_temp_path /tmp/scgi_temp;
    server {
        listen 3000;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        # Basic security headers
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options SAMEORIGIN;
        
        # Static file caching
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 30d;
            add_header Cache-Control "public, no-transform";
        }
        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        # Proxy requests to the backend with CORS handling
        location /api/ {
            # Using the Docker internal DNS resolver
            resolver 127.0.0.11 valid=30s;
            
            # Use the backend container name from Docker network
            set $backend_upstream ${BACKEND_CONTAINER};
            proxy_pass http://$backend_upstream:3001;
            
            # Handle CORS preflight requests
            if ($request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' '*';
                add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
                add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain charset=UTF-8';
                add_header 'Content-Length' 0;
                return 204;
            }
            
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 15s;
            proxy_read_timeout 30s;
            
            # Add CORS headers
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
        }
    }
}
EOF
                        """
                    }
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir("${BACKEND_DIR}") {
                    withCredentials([
                        string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI'),
                        string(credentialsId: 'cloudinary-cloud-name', variable: 'CLOUDINARY_CLOUD_NAME'),
                        string(credentialsId: 'cloudinary-api-key', variable: 'CLOUDINARY_API_KEY'),
                        string(credentialsId: 'cloudinary-api-secret', variable: 'CLOUDINARY_API_SECRET'),
                        string(credentialsId: 'clerk-secret-key', variable: 'CLERK_SECRET_KEY'),
                        string(credentialsId: 'clerk-publishable-key', variable: 'CLERK_PUBLISHABLE_KEY'),
                        string(credentialsId: 'stripe-secret-key', variable: 'STRIPE_SECRET_KEY'),
                        string(credentialsId: 'stripe-publishable-key', variable: 'STRIPE_PUBLISHABLE_KEY'),
                        string(credentialsId: 'webhook-endpoint-secret', variable: 'WEBHOOK_ENDPOINT_SECRET')
                    ]) {
                        sh "cp .env.${DEPLOY_ENV} .env"
                        sh 'npm i'
                        sh 'npm run build'
                        sh """
                        docker build \\
                            --build-arg NODE_ENV=${DEPLOY_ENV} \\
                            --build-arg PORT=3001 \\
                            --build-arg MONGODB_URI=${MONGODB_URI} \\
                            --build-arg CORS_ORIGIN=http://${FRONTEND_CONTAINER}:3000,http://localhost:${FRONTEND_PORT},* \\
                            --build-arg CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME} \\
                            --build-arg CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY} \\
                            --build-arg CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET} \\
                            --build-arg CLERK_SECRET_KEY=${CLERK_SECRET_KEY} \\
                            --build-arg CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY} \\
                            --build-arg STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY} \\
                            --build-arg STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY} \\
                            --build-arg WEBHOOK_ENDPOINT_SECRET=${WEBHOOK_ENDPOINT_SECRET} \\
                            -t ${BACKEND_IMAGE}:${BUILD_NUMBER} .
                        """
                        sh "docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                expression {
                    return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'qa' || env.BRANCH_NAME == 'dev'
                }
            }
            steps {
                script {
                    // Stop and remove existing containers
                    sh "docker stop ${FRONTEND_CONTAINER} || true"
                    sh "docker rm ${FRONTEND_CONTAINER} || true"
                    sh "docker stop ${BACKEND_CONTAINER} || true"
                    sh "docker rm ${BACKEND_CONTAINER} || true"
                    
                    // Remove and recreate network
                    sh "docker network rm ${DOCKER_NETWORK} || true"
                    sh "docker network create ${DOCKER_NETWORK} || true"

                    withCredentials([
                        string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI'),
                        string(credentialsId: 'cloudinary-url', variable: 'CLOUDINARY_URL'),
                        string(credentialsId: 'cloudinary-cloud-name', variable: 'CLOUDINARY_CLOUD_NAME'),
                        string(credentialsId: 'cloudinary-api-key', variable: 'CLOUDINARY_API_KEY'),
                        string(credentialsId: 'cloudinary-api-secret', variable: 'CLOUDINARY_API_SECRET'),
                        string(credentialsId: 'clerk-secret-key', variable: 'CLERK_SECRET_KEY'),
                        string(credentialsId: 'clerk-publishable-key', variable: 'CLERK_PUBLISHABLE_KEY'),
                        string(credentialsId: 'stripe-secret-key', variable: 'STRIPE_SECRET_KEY'),
                        string(credentialsId: 'stripe-publishable-key', variable: 'STRIPE_PUBLISHABLE_KEY'),
                        string(credentialsId: 'webhook-endpoint-secret', variable: 'WEBHOOK_ENDPOINT_SECRET')
                    ]) {
                        // Start backend container first
                        sh """
                        docker run -d \\
                            -p ${BACKEND_PORT}:3001 \\
                            --name ${BACKEND_CONTAINER} \\
                            --network ${DOCKER_NETWORK} \\
                            --hostname ${BACKEND_CONTAINER} \\
                            -e NODE_ENV=${DEPLOY_ENV} \\
                            -e PORT=3001 \\
                            -e MONGODB_URI=${MONGODB_URI} \\
                            -e CORS_ORIGIN=http://${FRONTEND_CONTAINER}:3000,http://localhost:${FRONTEND_PORT},* \\
                            -e CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME} \\
                            -e CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY} \\
                            -e CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET} \\
                            -e CLERK_SECRET_KEY=${CLERK_SECRET_KEY} \\
                            -e CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY} \\
                            -e STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY} \\
                            -e STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY} \\
                            -e WEBHOOK_ENDPOINT_SECRET=${WEBHOOK_ENDPOINT_SECRET} \\
                            --restart unless-stopped \\
                            ${BACKEND_IMAGE}:latest
                        """

                        // Wait for backend to start
                        sh "sleep 10"
                        
                        // Get backend IP for host file
                        sh """
                        # Get backend IP
                        BACKEND_IP=\$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${BACKEND_CONTAINER})
                        echo "Backend container IP: \${BACKEND_IP}"
                        
                        # Create /etc/hosts entry for the frontend container
                        echo "\${BACKEND_IP} ${BACKEND_CONTAINER}" > /tmp/backend_hosts
                        
                        # Deploy frontend with Docker DNS properly configured
                        docker run -d \\
                            -p ${FRONTEND_PORT}:3000 \\
                            --name ${FRONTEND_CONTAINER} \\
                            --network ${DOCKER_NETWORK} \\
                            --hostname ${FRONTEND_CONTAINER} \\
                            --add-host ${BACKEND_CONTAINER}:\${BACKEND_IP} \\
                            -e VITE_API_URL=http://${BACKEND_CONTAINER}:3001 \\
                            -e VITE_ENVIRONMENT=${DEPLOY_ENV} \\
                            -e VITE_CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME} \\
                            -e VITE_CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY} \\
                            -e VITE_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY} \\
                            -e VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY} \\
                            --restart unless-stopped \\
                            ${FRONTEND_IMAGE}:latest
                        """
                        
                        // Create an env-config.js file for runtime configuration
                        sh """
                        # Create a runtime config file inside the frontend container
                        docker exec ${FRONTEND_CONTAINER} sh -c "echo 'window.ENV = {' > /usr/share/nginx/html/env-config.js"
                        docker exec ${FRONTEND_CONTAINER} sh -c "echo '  VITE_API_URL: \"http://${BACKEND_CONTAINER}:3001\",' >> /usr/share/nginx/html/env-config.js"
                        docker exec ${FRONTEND_CONTAINER} sh -c "echo '  VITE_ENVIRONMENT: \"${DEPLOY_ENV}\",' >> /usr/share/nginx/html/env-config.js"
                        docker exec ${FRONTEND_CONTAINER} sh -c "echo '  VITE_CLOUDINARY_CLOUD_NAME: \"${CLOUDINARY_CLOUD_NAME}\",' >> /usr/share/nginx/html/env-config.js"
                        docker exec ${FRONTEND_CONTAINER} sh -c "echo '  VITE_CLOUDINARY_API_KEY: \"${CLOUDINARY_API_KEY}\",' >> /usr/share/nginx/html/env-config.js"
                        docker exec ${FRONTEND_CONTAINER} sh -c "echo '  VITE_CLERK_PUBLISHABLE_KEY: \"${CLERK_PUBLISHABLE_KEY}\",' >> /usr/share/nginx/html/env-config.js"
                        docker exec ${FRONTEND_CONTAINER} sh -c "echo '  VITE_STRIPE_PUBLISHABLE_KEY: \"${STRIPE_PUBLISHABLE_KEY}\",' >> /usr/share/nginx/html/env-config.js"
                        docker exec ${FRONTEND_CONTAINER} sh -c "echo '};' >> /usr/share/nginx/html/env-config.js"
                        """
                        
                        // Add a script tag to include env-config.js in index.html
                        sh """
                        docker exec ${FRONTEND_CONTAINER} sh -c "sed -i 's|</head>|<script src=\"/env-config.js\"></script></head>|' /usr/share/nginx/html/index.html"
                        """
                        
                        // Debug information
                        sh """
                        echo "Network information:"
                        docker network inspect ${DOCKER_NETWORK}
                        """
                        
                        sh """
                        echo "Container connectivity test from frontend to backend:"
                        docker exec ${FRONTEND_CONTAINER} ping -c 2 ${BACKEND_CONTAINER} || true
                        """
                        
                        sh """
                        echo "Verifying DNS resolution from frontend container:"
                        docker exec ${FRONTEND_CONTAINER} cat /etc/hosts || true
                        docker exec ${FRONTEND_CONTAINER} nslookup ${BACKEND_CONTAINER} || true
                        """
                        
                        sh """
                        echo "Frontend environment variables:"
                        docker exec ${FRONTEND_CONTAINER} printenv | grep VITE || true
                        """
                        
                        sh """
                        echo "Frontend env-config.js content:"
                        docker exec ${FRONTEND_CONTAINER} cat /usr/share/nginx/html/env-config.js || true
                        """
                        
                        sh """
                        echo "Backend logs:"
                        docker logs ${BACKEND_CONTAINER} | tail -n 20 || true
                        """
                        
                        sh """
                        echo "Frontend logs:"
                        docker logs ${FRONTEND_CONTAINER} | tail -n 20 || true
                        """
                    }

                    echo "Deployed to ${DEPLOY_ENV} environment"
                }
            }
        }
    }

    post {
        success {
            slackSend channel: 'team4',
                      color: 'good',
                      message: "✅ Build Successful for ${DEPLOY_ENV}! Frontend: ${FRONTEND_IMAGE}:${BUILD_NUMBER}, Backend: ${BACKEND_IMAGE}:${BUILD_NUMBER}"
        }
        failure {
            slackSend channel: 'team4',
                      color: 'danger',
                      message: "❌ Build Failed for ${DEPLOY_ENV}!"
        }
        unstable {
            slackSend channel: 'team4',
                      color: 'warning',
                      message: "⚠ Build Unstable for ${DEPLOY_ENV}!"
        }
    }
}
