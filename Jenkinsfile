pipeline {
    agent any
    
    environment {
        FRONTEND_DIR = "custom-thread-frontend"
        BACKEND_DIR = "custom-thread-backend"
        BRANCH_NAME = "${env.BRANCH_NAME}"
        DEPLOY_ENV = "${env.BRANCH_NAME == 'main' ? 'production' : (env.BRANCH_NAME == 'qa' ? 'qa' : 'development')}"
        FRONTEND_IMAGE = "custom-thread-frontend-${DEPLOY_ENV}"
        BACKEND_IMAGE = "custom-thread-backend-${DEPLOY_ENV}"
        FRONTEND_CONTAINER = "frontend-${DEPLOY_ENV}"
        BACKEND_CONTAINER = "backend-${DEPLOY_ENV}"
        FRONTEND_PORT = "3000"
        BACKEND_PORT = "3001"
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
                            VITE_CLOUDINARY_URL=${env.CLOUDINARY_URL}
                            VITE_CLOUDINARY_CLOUD_NAME=${env.CLOUDINARY_CLOUD_NAME}
                            VITE_CLOUDINARY_API_KEY=${env.CLOUDINARY_API_KEY}
                            VITE_CLOUDINARY_API_SECRET=${env.CLOUDINARY_API_SECRET}
                            VITE_CLERK_PUBLISHABLE_KEY=${env.CLERK_PUBLISHABLE_KEY}
                            VITE_API_URL=http://localhost:${env.BACKEND_PORT}
                            VITE_ENVIRONMENT=${env.DEPLOY_ENV}
                            VITE_STRIPE_PUBLISHABLE_KEY=${env.STRIPE_PUBLISHABLE_KEY}
                        """
                        
                        writeFile file: "${BACKEND_DIR}/.env.${DEPLOY_ENV}", text: """
                            NODE_ENV=${env.DEPLOY_ENV}
                            PORT=3001
                            MONGODB_URI=${env.MONGODB_URI}
                            CORS_ORIGIN=http://localhost:${env.FRONTEND_PORT}
                            CLOUDINARY_CLOUD_NAME=${env.CLOUDINARY_CLOUD_NAME}
                            CLOUDINARY_API_KEY=${env.CLOUDINARY_API_KEY}
                            CLOUDINARY_API_SECRET=${env.CLOUDINARY_API_SECRET}
                            CLERK_SECRET_KEY=${env.CLERK_SECRET_KEY}
                            CLERK_PUBLISHABLE_KEY=${env.CLERK_PUBLISHABLE_KEY}
                            STRIPE_SECRET_KEY=${env.STRIPE_SECRET_KEY}
                            STRIPE_PUBLISHABLE_KEY=${env.STRIPE_PUBLISHABLE_KEY}
                            WEBHOOK_ENDPOINT_SECRET=${env.WEBHOOK_ENDPOINT_SECRET}
                        """
                    }
                }
            }
        }
        
        stage('Frontend Build') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh "cp .env.${DEPLOY_ENV} .env"
                    sh 'npm i'
                    sh 'npm run build'
                    sh """
                    docker build \
                        --build-arg VITE_API_URL=http://localhost:${env.BACKEND_PORT} \
                        --build-arg VITE_ENVIRONMENT=${env.DEPLOY_ENV} \
                        --build-arg VITE_CLOUDINARY_CLOUD_NAME=${env.CLOUDINARY_CLOUD_NAME} \
                        --build-arg VITE_CLOUDINARY_API_KEY=${env.CLOUDINARY_API_KEY} \
                        --build-arg VITE_CLERK_PUBLISHABLE_KEY=${env.CLERK_PUBLISHABLE_KEY} \
                        --build-arg VITE_STRIPE_PUBLISHABLE_KEY=${env.STRIPE_PUBLISHABLE_KEY} \
                        -t ${env.FRONTEND_IMAGE}:${env.BUILD_NUMBER} .
                    """
                    sh "docker tag ${env.FRONTEND_IMAGE}:${env.BUILD_NUMBER} ${env.FRONTEND_IMAGE}:latest"
                }
            }
        }
        
        stage('Backend Build') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh "cp .env.${DEPLOY_ENV} .env"
                    sh 'npm i'
                    sh 'npm run build'
                    sh """
                    docker build \
                        --build-arg NODE_ENV=${env.DEPLOY_ENV} \
                        --build-arg PORT=3001 \
                        --build-arg MONGODB_URI=${env.MONGODB_URI} \
                        --build-arg CORS_ORIGIN=http://localhost:${env.FRONTEND_PORT} \
                        --build-arg CLOUDINARY_CLOUD_NAME=${env.CLOUDINARY_CLOUD_NAME} \
                        --build-arg CLOUDINARY_API_KEY=${env.CLOUDINARY_API_KEY} \
                        --build-arg CLOUDINARY_API_SECRET=${env.CLOUDINARY_API_SECRET} \
                        --build-arg CLERK_SECRET_KEY=${env.CLERK_SECRET_KEY} \
                        --build-arg CLERK_PUBLISHABLE_KEY=${env.CLERK_PUBLISHABLE_KEY} \
                        --build-arg STRIPE_SECRET_KEY=${env.STRIPE_SECRET_KEY} \
                        --build-arg STRIPE_PUBLISHABLE_KEY=${env.STRIPE_PUBLISHABLE_KEY} \
                        --build-arg WEBHOOK_ENDPOINT_SECRET=${env.WEBHOOK_ENDPOINT_SECRET} \
                        -t ${env.BACKEND_IMAGE}:${env.BUILD_NUMBER} .
                    """
                    sh "docker tag ${env.BACKEND_IMAGE}:${env.BUILD_NUMBER} ${env.BACKEND_IMAGE}:latest"
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
                    sh "docker stop ${env.FRONTEND_CONTAINER} || true"
                    sh "docker rm ${env.FRONTEND_CONTAINER} || true"
                    sh "docker stop ${env.BACKEND_CONTAINER} || true"
                    sh "docker rm ${env.BACKEND_CONTAINER} || true"
                    
                    sh """
                    docker run -d \
                        -p ${env.BACKEND_PORT}:3001 \
                        --name ${env.BACKEND_CONTAINER} \
                        -e NODE_ENV=${env.DEPLOY_ENV} \
                        -e PORT=3001 \
                        -e MONGODB_URI=${env.MONGODB_URI} \
                        -e CORS_ORIGIN=http://localhost:${env.FRONTEND_PORT} \
                        -e CLOUDINARY_CLOUD_NAME=${env.CLOUDINARY_CLOUD_NAME} \
                        -e CLOUDINARY_API_KEY=${env.CLOUDINARY_API_KEY} \
                        -e CLOUDINARY_API_SECRET=${env.CLOUDINARY_API_SECRET} \
                        -e CLERK_SECRET_KEY=${env.CLERK_SECRET_KEY} \
                        -e CLERK_PUBLISHABLE_KEY=${env.CLERK_PUBLISHABLE_KEY} \
                        -e STRIPE_SECRET_KEY=${env.STRIPE_SECRET_KEY} \
                        -e STRIPE_PUBLISHABLE_KEY=${env.STRIPE_PUBLISHABLE_KEY} \
                        -e WEBHOOK_ENDPOINT_SECRET=${env.WEBHOOK_ENDPOINT_SECRET} \
                        --restart unless-stopped \
                        ${env.BACKEND_IMAGE}:latest
                    """
                    
                    sh """
                    docker run -d \
                        -p ${env.FRONTEND_PORT}:3000 \
                        --name ${env.FRONTEND_CONTAINER} \
                        -e VITE_API_URL=http://localhost:${env.BACKEND_PORT} \
                        -e VITE_ENVIRONMENT=${env.DEPLOY_ENV} \
                        -e VITE_CLOUDINARY_CLOUD_NAME=${env.CLOUDINARY_CLOUD_NAME} \
                        -e VITE_CLOUDINARY_API_KEY=${env.CLOUDINARY_API_KEY} \
                        -e VITE_CLERK_PUBLISHABLE_KEY=${env.CLERK_PUBLISHABLE_KEY} \
                        -e VITE_STRIPE_PUBLISHABLE_KEY=${env.STRIPE_PUBLISHABLE_KEY} \
                        --restart unless-stopped \
                        ${env.FRONTEND_IMAGE}:latest
                    """
                    
                    echo "Deployed to ${env.DEPLOY_ENV} environment"
                }
            }
        }
    }
    
    post {
        success {
            slackSend channel: 'team4', 
                      color: 'good', 
                      message: "✅ Build Successful for ${env.DEPLOY_ENV}! Frontend: ${env.FRONTEND_IMAGE}:${env.BUILD_NUMBER}, Backend: ${env.BACKEND_IMAGE}:${env.BUILD_NUMBER}"
        }
        failure {
            slackSend channel: 'team4', 
                      color: 'danger', 
                      message: "❌ Build Failed for ${env.DEPLOY_ENV}!"
        }
        unstable {
            slackSend channel: 'team4',
                      color: 'warning',
                      message: "⚠️ Build Unstable for ${env.DEPLOY_ENV}!"
        }
    }
}
