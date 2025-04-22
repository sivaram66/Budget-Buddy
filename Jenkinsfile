pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'hvsaikrishna'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    credentialsId: '0ad543a7-8c82-4c61-98d8-ff74d910a2fc', 
                    url: 'https://github.com/hvsk004/v2_BudgetBuddy.git'
            }
        }

    stage('Generate Image Tag') {
      steps {
        script {
          def shortCommit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
          env.IMAGE_TAG = shortCommit
        }

      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          sh """
          docker build -t $DOCKERHUB_USER/budgetbuddy-frontend:${IMAGE_TAG} ./client
          docker tag $DOCKERHUB_USER/budgetbuddy-frontend:${IMAGE_TAG} $DOCKERHUB_USER/budgetbuddy-frontend:latest

          docker build -t $DOCKERHUB_USER/budgetbuddy-backend:${IMAGE_TAG} ./
          docker tag $DOCKERHUB_USER/budgetbuddy-backend:${IMAGE_TAG} $DOCKERHUB_USER/budgetbuddy-backend:latest
          """
        }

      }
    }

    stage('Push to Docker Hub') {
      steps {
        script {
          sh """
          docker push $DOCKERHUB_USER/budgetbuddy-frontend:${IMAGE_TAG}
          docker push $DOCKERHUB_USER/budgetbuddy-frontend:latest

          docker push $DOCKERHUB_USER/budgetbuddy-backend:${IMAGE_TAG}
          docker push $DOCKERHUB_USER/budgetbuddy-backend:latest
          """
        }

      }
    }

    stage('Deploy') {
      steps {
        sh 'docker-compose down'
        sh 'docker-compose pull'
        sh 'docker-compose up -d'
      }
    }

  }
  environment {
    DOCKERHUB_USER = 'hvsaikrishna'
  }
  post {
    failure {
      echo 'Build failed!'
    }

  }
}