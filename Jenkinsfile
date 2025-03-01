pipeline {
    agent any
    environment {
        DOCKER_HUB_USERNAME = "abhisheksh99"
        IMAGE_NAME = "custom-thread-frontend"
        IMAGE_TAG = "${BUILD_NUMBER}"
        CONTAINER_NAME = "frontend-container"
        DOCKER_REPO = "${DOCKER_HUB_USERNAME}/${IMAGE_NAME}"
    }
    stages {
        stage('Navigate to Frontend Directory') {
            steps {
                dir("custom-thread-frontend") {
                    echo 'Inside frontend directory'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                dir("custom-thread-frontend") {
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                    sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_REPO}:${IMAGE_TAG}"
                    sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_REPO}:latest"
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'abhisheksh99-dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh "echo ${PASSWORD} | docker login -u ${USERNAME} --password-stdin"
                    sh "docker push ${DOCKER_REPO}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_REPO}:latest"
                }
            }
        }
        stage('Deploy Container') {
            steps {
                script {
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    sh "docker run -d -p 3000:3000 --name ${CONTAINER_NAME} --restart unless-stopped --health-cmd='curl -f http://localhost:3000 || exit 1' --health-interval=30s ${DOCKER_REPO}:latest"
                }
            }
        }
    }
    post {
        success {
            echo "Deployment Successful!"
            slackSend channel: 'team4', 
                      color: 'good', 
                      message: "✅ Build Successful! Image: ${DOCKER_REPO}:${IMAGE_TAG}"
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
