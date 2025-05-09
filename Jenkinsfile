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
        BACKEND_API = "https://customthread.onrender.com"
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
                        writeFile file: "${FRONTEND_DIR}/.env.${DEPLOY_ENV}", text: """
                            VITE_CLOUDINARY_URL=${CLOUDINARY_URL}
                            VITE_CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
                            VITE_CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
                            VITE_CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
                            VITE_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}
                            VITE_API_URL=${BACKEND_API}
                            VITE_ENVIRONMENT=${DEPLOY_ENV}
                            VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
                        """

                        writeFile file: "${BACKEND_DIR}/.env.${DEPLOY_ENV}", text: """
                            NODE_ENV=${DEPLOY_ENV}
                            PORT=3001
                            MONGODB_URI=${MONGODB_URI}
                            CORS_ORIGIN=http://${FRONTEND_CONTAINER}:3000,http://localhost:${FRONTEND_PORT}
                            CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
                            CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
                            CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
                            CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
                            CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}
                            STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
                            STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
                            WEBHOOK_ENDPOINT_SECRET=${WEBHOOK_ENDPOINT_SECRET}
                        """
                        
                        // Generate TypeScript environment config file
                        writeFile file: "${BACKEND_DIR}/src/config/env.config.ts", text: """
                            import dotenv from 'dotenv';
                            
                            // Load environment variables
                            dotenv.config();
                            
                            export const env = {
                                NODE_ENV: process.env.NODE_ENV || '${DEPLOY_ENV}',
                                PORT: parseInt(process.env.PORT || '3001', 10),
                                MONGODB_URI: process.env.MONGODB_URI || '${MONGODB_URI}',
                                CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://${FRONTEND_CONTAINER}:3000,http://localhost:${FRONTEND_PORT}',
                                CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '${CLOUDINARY_CLOUD_NAME}',
                                CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '${CLOUDINARY_API_KEY}',
                                CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '${CLOUDINARY_API_SECRET}',
                                CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || '${CLERK_SECRET_KEY}',
                                CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || '${CLERK_PUBLISHABLE_KEY}',
                                STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '${STRIPE_SECRET_KEY}',
                                STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '${STRIPE_PUBLISHABLE_KEY}',
                                WEBHOOK_ENDPOINT_SECRET: process.env.WEBHOOK_ENDPOINT_SECRET || '${WEBHOOK_ENDPOINT_SECRET}',
                            } as const;
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
                            --build-arg VITE_API_URL=${BACKEND_API} \\
                            --build-arg VITE_ENVIRONMENT=${DEPLOY_ENV} \\
                            --build-arg VITE_CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME} \\
                            --build-arg VITE_CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY} \\
                            --build-arg VITE_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY} \\
                            --build-arg VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY} \\
                            -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} .
                        """
                        sh "docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest"
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
                        
                        // Ensure env.config.ts exists for TypeScript compilation
                        sh "ls -la src/config/"
                        
                        sh 'npm i'
                        sh 'npm run build'
                        sh """
                        docker build \\
                            --build-arg NODE_ENV=${DEPLOY_ENV} \\
                            --build-arg PORT=3001 \\
                            --build-arg MONGODB_URI=${MONGODB_URI} \\
                            --build-arg CORS_ORIGIN=http://${FRONTEND_CONTAINER}:3000,http://localhost:${FRONTEND_PORT} \\
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
                        // Start backend container
                        sh """
                        docker run -d \\
                            -p ${BACKEND_PORT}:3001 \\
                            --name ${BACKEND_CONTAINER} \\
                            --network ${DOCKER_NETWORK} \\
                            -e NODE_ENV=${DEPLOY_ENV} \\
                            -e PORT=3001 \\
                            -e MONGODB_URI=${MONGODB_URI} \\
                            -e CORS_ORIGIN=http://${FRONTEND_CONTAINER}:3000,http://localhost:${FRONTEND_PORT} \\
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

                        // Start frontend container
                        sh """
                        docker run -d \\
                            -p ${FRONTEND_PORT}:3000 \\
                            --name ${FRONTEND_CONTAINER} \\
                            --network ${DOCKER_NETWORK} \\
                            -e VITE_ENVIRONMENT=${DEPLOY_ENV} \\
                            -e VITE_CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME} \\
                            -e VITE_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY} \\
                            -e VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY} \\
                            --restart unless-stopped \\
                            ${FRONTEND_IMAGE}:latest
                        """
                    }
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
