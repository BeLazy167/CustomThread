pipeline {
    agent any
    
    environment {
        FRONTEND_DIR = "custom-thread-frontend"
        BACKEND_DIR = "custom-thread-backend"
        BRANCH_NAME = "${env.BRANCH_NAME}"
        // Define environment-specific variables
        DEPLOY_ENV = "${BRANCH_NAME == 'main' ? 'production' : (BRANCH_NAME == 'qa' ? 'qa' : 'development')}"
        FRONTEND_IMAGE = "custom-thread-frontend-${DEPLOY_ENV}"
        BACKEND_IMAGE = "custom-thread-backend-${DEPLOY_ENV}"
        FRONTEND_CONTAINER = "frontend-${DEPLOY_ENV}"
        BACKEND_CONTAINER = "backend-${DEPLOY_ENV}"
        // Port mapping based on environment
        FRONTEND_PORT = "${BRANCH_NAME == 'main' ? '3000' : (BRANCH_NAME == 'qa' ? '3001' : '3002')}"
        BACKEND_PORT = "${BRANCH_NAME == 'main' ? '4000' : (BRANCH_NAME == 'qa' ? '4001' : '4002')}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Building branch: ${BRANCH_NAME} for ${DEPLOY_ENV} environment"
            }
        }
        
        stage('Frontend Build') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm ci'
                    sh 'npm run build'
                    sh "docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} ."
                    sh "docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest"
                }
            }
        }
        
        stage('Backend Build') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'npm ci'
                    sh 'npm run build'
                    sh "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ."
                    sh "docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest"
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh 'npm test -- --watchAll=false'
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'npm test'
                        }
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                expression { 
                    return BRANCH_NAME == 'main' || BRANCH_NAME == 'qa' || BRANCH_NAME == 'dev'
                }
            }
            steps {
                script {
                    // Stop and remove existing containers
                    sh "docker stop ${FRONTEND_CONTAINER} || true"
                    sh "docker rm ${FRONTEND_CONTAINER} || true"
                    sh "docker stop ${BACKEND_CONTAINER} || true"
                    sh "docker rm ${BACKEND_CONTAINER} || true"
                    
                    // Deploy frontend container
                    sh """
                    docker run -d \
                        -p ${FRONTEND_PORT}:3000 \
                        --name ${FRONTEND_CONTAINER} \
                        --restart unless-stopped \
                        --health-cmd='curl -f http://localhost:3000 || exit 1' \
                        --health-interval=30s \
                        ${FRONTEND_IMAGE}:latest
                    """
                    
                    // Deploy backend container
                    sh """
                    docker run -d \
                        -p ${BACKEND_PORT}:4000 \
                        --name ${BACKEND_CONTAINER} \
                        --restart unless-stopped \
                        --health-cmd='curl -f http://localhost:4000/health || exit 1' \
                        --health-interval=30s \
                        ${BACKEND_IMAGE}:latest
                    """
                    
                    echo "Deployed to ${DEPLOY_ENV} environment"
                    echo "Frontend available at: http://localhost:${FRONTEND_PORT}"
                    echo "Backend available at: http://localhost:${BACKEND_PORT}"
                }
            }
        }
    }
    
    post {
        success {
            echo "Pipeline completed successfully for ${DEPLOY_ENV} environment!"
            slackSend channel: 'team4', 
                      color: 'good', 
                      message: "✅ Build Successful for ${DEPLOY_ENV}! Frontend: ${FRONTEND_IMAGE}:${BUILD_NUMBER}, Backend: ${BACKEND_IMAGE}:${BUILD_NUMBER}"
        }
        failure {
            echo "Pipeline failed for ${DEPLOY_ENV} environment!"
            slackSend channel: 'team4', 
                      color: 'danger', 
                      message: "❌ Build Failed for ${DEPLOY_ENV}!"
        }
        unstable {
            slackSend channel: 'team4',
                      color: 'warning',
                      message: "⚠️ Build Unstable for ${DEPLOY_ENV}!"
        }
    }
}
