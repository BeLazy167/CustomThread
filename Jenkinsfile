pipeline {
    agent any

    environment {
        IMAGE_NAME = "custom-thread-frontend"
        CONTAINER_NAME = "frontend-container"
    }

    stages {
        stage('Clone Repository') {
            steps {
              git branch: 'main', url: 'https://github.com/BeLazy167/CustomThread.git'
            }
        }

        stage('Navigate to Frontend Directory') {
            steps {
                dir('custom-thread-frontend') {
                    echo 'Inside frontend directory'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('custom-thread-frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build React App') {
            steps {
                dir('custom-thread-frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('custom-thread-frontend') {
                    sh 'docker build -t $IMAGE_NAME .'
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    // Stop and remove old container if it exists
                    sh 'docker stop $CONTAINER_NAME || true'
                    sh 'docker rm $CONTAINER_NAME || true'

                    // Run new container
                    sh 'docker run -d -p 3000:3000--name $CONTAINER_NAME $IMAGE_NAME'
                }
            }
        }
    }

    post {
        success {
            echo "Deployment Successful! Access your app at http://52.207.212.245"
        }
        failure {
            echo "Deployment Failed!"
        }
    }
}
