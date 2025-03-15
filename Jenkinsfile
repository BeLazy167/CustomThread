pipeline {
    agent any
    
    environment {
        FRONTEND_DIR = "custom-thread-frontend"
        BACKEND_DIR = "custom-thread-backend"
        BRANCH_NAME = "main"
        DEPLOY_ENV = "${env.BRANCH_NAME == 'main' ? 'production' : (env.BRANCH_NAME == 'qa' ? 'qa' : 'development')}"
        FRONTEND_IMAGE = "custom-thread-frontend-${DEPLOY_ENV}"
        BACKEND_IMAGE = "custom-thread-backend-${DEPLOY_ENV}"
        FRONTEND_CONTAINER = "frontend-${DEPLOY_ENV}"
        BACKEND_CONTAINER = "backend-${DEPLOY_ENV}"
        FRONTEND_PORT = "3000"
        BACKEND_PORT = "3001"
        DOCKER_NETWORK = "customthread-network-${DEPLOY_ENV}"
    }
    
    stages {
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
                            VITE_API_URL=http://${BACKEND_CONTAINER}:3001
                            VITE_ENVIRONMENT=${DEPLOY_ENV}
                            VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
                        """
                        
                        writeFile file: "${BACKEND_DIR}/.env.${DEPLOY_ENV}", text: """
                            NODE_ENV=${DEPLOY_ENV}
                            PORT=3001
                            MONGODB_URI=${MONGODB_URI}
                            CORS_ORIGIN=http://${FRONTEND_CONTAINER}:3000
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
                        docker build \
                            --build-arg VITE_API_URL=http://${BACKEND_CONTAINER}:3001 \
                            --build-arg VITE_ENVIRONMENT=${DEPLOY_ENV} \
                            --build-arg VITE_CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME} \
                            --build-arg VITE_CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY} \
                            --build-arg VITE_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY} \
                            --build-arg VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY} \
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
                        sh 'npm i'
                        sh 'npm run build'
                        sh """
                        docker build \
                            --build-arg NODE_ENV=${DEPLOY_ENV} \
                            --build-arg PORT=3001 \
                            --build-arg MONGODB_URI=${MONGODB_URI} \
                            --build-arg CORS_ORIGIN=http://${FRONTEND_CONTAINER}:3000 \
                            --build-arg CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME} \
                            --build-arg CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY} \
                            --build-arg CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET} \
                            --build-arg CLERK_SECRET_KEY=${CLERK_SECRET_KEY} \
                            --build-arg CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY} \
                            --build-arg STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY} \
                            --build-arg STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY} \
                            --build-arg WEBHOOK_ENDPOINT_SECRET=${WEBHOOK_ENDPOINT_SECRET} \
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
                    // Clean up existing containers and networks
                    sh "docker stop ${FRONTEND_CONTAINER} || true"
                    sh "docker rm ${FRONTEND_CONTAINER} || true"
                    sh "docker stop ${BACKEND_CONTAINER} || true"
                    sh "docker rm ${BACKEND_CONTAINER} || true"
                    sh "docker network rm ${DOCKER_NETWORK} || true"
                    
                    // Create Docker network
                    sh "docker network create ${DOCKER_NETWORK} || true"
                    
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
                        // Run backend container
                        sh """
                        docker run -d \
                            -p ${BACKEND_PORT}:3001 \
                            --name ${BACKEND_CONTAINER} \
                            --network ${DOCKER_NETWORK} \
                            -e NODE_ENV=${DEPLOY_ENV} \
                            -e PORT=3001 \
                            -e MONGODB_URI=${MONGODB_URI} \
                            -e CORS_ORIGIN=http://${FRONTEND_CONTAINER}:3000 \
                            -e CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME} \
                            -e CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY} \
                            -e CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET} \
                            -e CLERK_SECRET_KEY=${CLERK_SECRET_KEY} \
                            -e CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY} \
                            -e STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY} \
                            -e STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY} \
                            -e WEBHOOK_ENDPOINT_SECRET=${WEBHOOK_ENDPOINT_SECRET} \
                            --restart unless-stopped \
                            ${BACKEND_IMAGE}:latest
                        """
                        
                        // Wait for backend to fully start
                        sh "sleep 10"
                        
                        // Run frontend container
                        sh """
                        docker run -d \
                            -p ${FRONTEND_PORT}:3000 \
                            --name ${FRONTEND_CONTAINER} \
                            --network ${DOCKER_NETWORK} \
                            -e VITE_API_URL=http://${BACKEND_CONTAINER}:3001 \
                            -e VITE_ENVIRONMENT=${DEPLOY_ENV} \
                            -e VITE_CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME} \
                            -e VITE_CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY} \
                            -e VITE_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY} \
                            -e VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY} \
                            --restart unless-stopped \
                            ${FRONTEND_IMAGE}:latest
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
