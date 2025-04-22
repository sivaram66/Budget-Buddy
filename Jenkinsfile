pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        git(url: 'https://github.com/hvsk004/v2_BudgetBuddy', branch: 'main', credentialsId: '0ad543a7-8c82-4c61-98d8-ff74d910a2fc')
        script {
          // Set the GIT_COMMIT environment variable to the short hash of the current commit
          env.GIT_COMMIT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          // Build frontend Docker image with git commit hash as tag
          sh "docker build -t hvsaikrishna/budgetbuddy-frontend:${env.GIT_COMMIT} ./client"
          sh "docker tag hvsaikrishna/budgetbuddy-frontend:${env.GIT_COMMIT} hvsaikrishna/budgetbuddy-frontend:latest"

          // Build backend Docker image with git commit hash as tag
          sh "docker build -t hvsaikrishna/budgetbuddy-backend:${env.GIT_COMMIT} ./"
          sh "docker tag hvsaikrishna/budgetbuddy-backend:${env.GIT_COMMIT} hvsaikrishna/budgetbuddy-backend:latest"
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        script {
          // Log in to Docker Hub
          withCredentials([usernamePassword(credentialsId: 'd3cee1a7-3cb5-4dee-b035-f8cfc4a7bcad', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          }

          // Push frontend and backend images to Docker Hub
          sh "docker push hvsaikrishna/budgetbuddy-frontend:${env.GIT_COMMIT}"
          sh "docker push hvsaikrishna/budgetbuddy-frontend:latest"

          sh "docker push hvsaikrishna/budgetbuddy-backend:${env.GIT_COMMIT}"
          sh "docker push hvsaikrishna/budgetbuddy-backend:latest"
        }
      }
    }
    // stage('Deploy') {
    //   steps {
    //       sh 'docker-compose down'
    //       sh 'docker-compose pull'
    //       sh 'docker-compose up -d'
    //     }
    //   }
    // }
    post {
      failure {
        echo 'Build failed!'
      }
    }
}