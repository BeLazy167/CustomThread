pipeline {
    agent any
    environment {
        IMAGE_NAME = "custom-thread-frontend"
        IMAGE_TAG = "${BUILD_NUMBER}"
        CONTAINER_NAME = "frontend-container"
    }
    stages {
        stage('Navigate to Frontend Directory') {
            steps {
                dir("custom-thread-frontend") {
                    echo 'Inside frontend directory'
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                dir("custom-thread-frontend") {
                    sh 'npm ci'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                dir("custom-thread-frontend") {
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                    sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
                }
            }
        }
        stage('Deploy Container') {
            steps {
                script {
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    sh "docker run -d -p 3000:3000 --name ${CONTAINER_NAME} --restart unless-stopped --health-cmd='curl -f http://localhost:3000 || exit 1' --health-interval=30s ${IMAGE_NAME}:latest"
                }
            }
        }
    }
    post {
        success {
            echo "Deployment Successful!"
            slackSend channel: 'team4', 
                      color: 'good', 
                      message: "✅ Build Successful! Image: ${IMAGE_NAME}:${IMAGE_TAG}"
        }
        failure {
            echo "Deployment Failed!"
            slackSend channel: 'team4', 
                      color: 'danger', 
                      message: "❌ Build Failed!"
        }
        unstable {
            slackSend channel: 'team4',
                      color: 'warning',
                      message: "⚠️ Build Unstable!"
        }
    }
}
