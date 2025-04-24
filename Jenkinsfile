  pipeline {
    agent any

    parameters {
      booleanParam(
        name: 'BUILD_IMAGES',
        defaultValue: true,
        description: 'Build Docker images?'
      )
      booleanParam(
        name: 'PUSH_IMAGES',
        defaultValue: true,
        description: 'Push Docker images to Docker Hub?'
      )
    }

    stages {
      stage('Clean Workspace') {
        steps {
          script {
            deleteDir()
          }
        }
      }
      stage('Checkout') {
        steps {
          git(
            url: 'https://github.com/hvsk004/v2_BudgetBuddy',
            branch: 'main',
            credentialsId: '0ad543a7-8c82-4c61-98d8-ff74d910a2fc'
          )
          script {
            // Set the GIT_COMMIT environment variable to the short hash of the current commit
            env.GIT_COMMIT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          }
        }
      }

      stage('Build Docker Images') {
        when {
          expression { params.BUILD_IMAGES }
        }
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
        when {
          expression { params.PUSH_IMAGES }
        }
        steps {
          script {
            // Log in to Docker Hub
            withCredentials([usernamePassword(
              credentialsId: 'd3cee1a7-3cb5-4dee-b035-f8cfc4a7bcad',
              usernameVariable: 'DOCKERHUB_USERNAME',
              passwordVariable: 'DOCKERHUB_PASSWORD'
            )]) {
              sh "echo ${DOCKERHUB_PASSWORD} | docker login -u ${DOCKERHUB_USERNAME} --password-stdin"

              // Push frontend images
              sh "docker push hvsaikrishna/budgetbuddy-frontend:${env.GIT_COMMIT}"
              sh "docker push hvsaikrishna/budgetbuddy-frontend:latest"

              // Push backend images
              sh "docker push hvsaikrishna/budgetbuddy-backend:${env.GIT_COMMIT}"
              sh "docker push hvsaikrishna/budgetbuddy-backend:latest"
            }
          }
        }
      }
      stage('Deploy Docker Containers') {
        steps {
          script {
            withCredentials([file(credentialsId: 'budgetbuddy-backend-env', variable: 'SECRET_ENV')]) {
              sh '''
                  cp "$SECRET_ENV" .env
                '''
            }
          }
          sh "ls"
          sh "docker compose down --rmi all --volumes"
          sh "docker compose up -d"
        }
      }
    }
  }