pipeline {
    agent any

    environment {
        IMAGE_NAME = "custom-thread-frontend"
        CONTAINER_NAME = "frontend-container"
        BASE_DIR = 'customthreads'  
        SLACK_CHANNEL = "#team4"
    }

    stages {

        stage('Clone Repository') {
            steps {
                dir("$BASE_DIR") {
                    git branch: 'main', url: 'https://github.com/BeLazy167/CustomThread.git'
                }
            }
        }

        stage('Navigate to Frontend Directory') {
            steps {
                dir("$BASE_DIR/custom-thread-frontend") {
                    echo 'Inside frontend directory'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir("$BASE_DIR/custom-thread-frontend") {
                    sh 'npm install'
                }
            }
        }

        stage('Build React App') {
            steps {
                dir("$BASE_DIR/custom-thread-frontend") {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir("$BASE_DIR/custom-thread-frontend") {
                    sh 'docker build -t $IMAGE_NAME .'
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    sh 'docker stop $CONTAINER_NAME || true'
                    sh 'docker rm $CONTAINER_NAME || true'
                    sh 'docker run -d -p 3000:3000 --name $CONTAINER_NAME $IMAGE_NAME'
                }
            }
        }
    }

    post {
        success {
            echo "Deployment Successful! Access your app at http://52.207.212.245"
            slackSend channel: SLACK_CHANNEL, message: "✅ *Deployment Successful!* 🎉\nYour app is live at: http://52.207.212.245", color: "good"
        }
        failure {
            echo "Deployment Failed!"
            slackSend channel: SLACK_CHANNEL, message: "❌ *Deployment Failed!* 😢 Check Jenkins logs for details.", color: "danger"
        }
    }
}
