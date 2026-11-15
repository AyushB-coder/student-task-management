pipeline {
    agent any

    environment {
        APP_NAME = 'student-task-manager'
        DOCKER_IMAGE = 'student-task-manager:latest'
        CONTAINER_NAME = 'student-task-manager-app'
        HOST_PORT = '80'
        CONTAINER_PORT = '80'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '=================================================='
                echo 'Stage 1: Checking out source code from GitHub...'
                echo '=================================================='
                checkout scm
            }
        }

        stage('Validate Application Files') {
            steps {
                echo '=================================================='
                echo 'Stage 2: Validating essential application files...'
                echo '=================================================='
                sh '''
                    echo "Checking core project files existence..."
                    test -f index.html || (echo "ERROR: index.html is missing!" && exit 1)
                    test -f style.css  || (echo "ERROR: style.css is missing!" && exit 1)
                    test -f script.js  || (echo "ERROR: script.js is missing!" && exit 1)
                    test -f test.js    || (echo "ERROR: test.js is missing!" && exit 1)
                    test -f README.md  || (echo "ERROR: README.md is missing!" && exit 1)
                    echo "SUCCESS: All core application files verified!"
                '''
            }
        }

        stage('Run Basic Application Tests') {
            steps {
                echo '=================================================='
                echo 'Stage 3: Running Automated Test Suite...'
                echo '=================================================='
                sh '''
                    if command -v node > /dev/null 2>&1; then
                        echo "Node.js detected. Executing test.js..."
                        node test.js
                    else
                        echo "Node.js not found in agent environment. Running fallback shell validations..."
                        grep -q "Student Task Manager" index.html || (echo "Validation failed: Main title missing" && exit 1)
                        grep -q "student_task_manager_tasks" script.js || (echo "Validation failed: Storage key missing" && exit 1)
                        echo "Fallback tests passed successfully!"
                    fi
                '''
            }
        }

        stage('Build Docker Image') {
            when {
                expression { fileExists('Dockerfile') }
            }
            steps {
                echo '=================================================='
                echo "Stage 4: Building Docker Image: ${DOCKER_IMAGE}..."
                echo '=================================================='
                sh '''
                    docker build -t ${DOCKER_IMAGE} .
                    echo "Docker image built successfully:"
                    docker images | grep ${APP_NAME} || true
                '''
            }
        }

        stage('Deploy Docker Container') {
            when {
                expression { fileExists('Dockerfile') }
            }
            steps {
                echo '=================================================='
                echo "Stage 5: Deploying Docker Container: ${CONTAINER_NAME}..."
                echo '=================================================='
                sh '''
                    # Stop running container if it exists
                    if [ $(docker ps -q -f name=^/${CONTAINER_NAME}$) ]; then
                        echo "Stopping running container ${CONTAINER_NAME}..."
                        docker stop ${CONTAINER_NAME}
                    fi

                    # Remove old container if it exists
                    if [ $(docker ps -a -q -f name=^/${CONTAINER_NAME}$) ]; then
                        echo "Removing previous container ${CONTAINER_NAME}..."
                        docker rm ${CONTAINER_NAME}
                    fi

                    # Run new container
                    echo "Starting new container on port ${HOST_PORT}..."
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        --restart unless-stopped \
                        ${DOCKER_IMAGE}

                    sleep 3

                    # Verify container status
                    if [ $(docker ps -q -f name=^/${CONTAINER_NAME}$) ]; then
                        echo "SUCCESS: Container ${CONTAINER_NAME} is active and running!"
                        docker ps -f name=${CONTAINER_NAME}
                    else
                        echo "ERROR: Container failed to start!"
                        docker logs ${CONTAINER_NAME}
                        exit 1
                    fi
                '''
            }
        }
    }

    post {
        success {
            echo '=================================================='
            echo ' Pipeline Execution Succeeded!'
            echo ' Application has passed all tests and is ready.'
            echo '=================================================='
        }
        failure {
            echo '=================================================='
            echo ' Pipeline Execution Failed!'
            echo ' Please check stage logs for troubleshooting.'
            echo '=================================================='
        }
    }
}
