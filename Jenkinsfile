// Pipeline for Interviewer CI - Builds and tests both frontend and backend, then pushes Docker images to Docker Hub. Triggers CD pipeline on success.
@Library('Shared') _
pipeline{

    agent any
    
    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 60, unit: 'MINUTES')
        timestamps()
        ansiColor('xterm')
    }

     parameters {
        string(name: 'FRONTEND_DOCKER_TAG', defaultValue: '', description: 'Frontend image tag')
        string(name: 'BACKEND_DOCKER_TAG',  defaultValue: '', description: 'Backend image tag')
        choice(name: 'ENVIRONMENT', choices: ['dev', 'staging', 'prod'], description: 'Target environment')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip OWASP + Trivy (emergency only)')
    }

    environment {
        DOCKER_HUB_USER='pratikmahara'
        REPO_URL= 'https://github.com/PratikMahara/voice-agent.git'
        SONAR_PROJECT='interviewer'
        IMAGE_BACKEND= "${DOCKER_HUB_USER}/interviewer-backend"
        IMAGE_FRONTEND= "${DOCKER_HUB_USER}/interviewer-frontend"

        SONAR_TOKEN= credentials('Sonar')
        DOCKER_CREDS= credentials('docker')

    }

    stages{

       stage('Validate Parameters') {
            steps {
                script {
                    if (!params.FRONTEND_DOCKER_TAG?.trim() || !params.BACKEND_DOCKER_TAG?.trim()) {
                        error('❌ FRONTEND_DOCKER_TAG and BACKEND_DOCKER_TAG are required')
                    }
                    echo """
                    ╔══════════════════════════════════════╗
                    ║  Interviewer CI — ${params.ENVIRONMENT.toUpperCase()} Build
                    ║  Frontend : ${params.FRONTEND_DOCKER_TAG}
                    ║  Backend  : ${params.BACKEND_DOCKER_TAG}
                    ╚══════════════════════════════════════╝
                    """
                }
            }
        }

        stage('Workspace Cleanup') {
            steps {
                cleanWs()
            }
        }

        stage('Git: Checkout') {
            steps{
                script{
                    code_checkout(env.REPO_URL,'main')
                }
            }
        }
        stage('Security & QUality'){
            when{
                expression {!params.SKIP_TESTS}
            }
            parallel {

                stage('Trivy: Filesystem Scan') {
                    steps {
                        timeout(time:10, unit: 'MINUTES') {
                            script {
                                trivy_scan()
                            }
                        }
                    }
                }


                stage('OWASP: Dependency Check') {
                    steps {
                        timeout(time: 20, unit: 'MINUTES') {
                            dependencyCheck(
                                odcInstallation: 'OWASP',
                                additionalArguments: '--scan . --disableNodeAudit --format XML'
                            )
                            dependencyCheckPublisher(pattern: '**/dependency-check-report.xml')
                        }
                    }
                }

                stage('SonarQube: Analysis') {
                    steps {
                        timeout(time: 10, unit: 'MINUTES') {
                            withSonarQubeEnv('Sonar') {
                                sh """
                                    docker run --rm --network=host \
                                      -e SONAR_TOKEN=${env.SONAR_TOKEN} \
                                      -v \$(pwd):/usr/src \
                                      sonarsource/sonar-scanner-cli \
                                      -Dsonar.projectKey=${env.SONAR_PROJECT} \
                                      -Dsonar.sources=. \
                                      -Dsonar.host.url=http://localhost:9000
                                """
                            }
                        }
                    }
                }








            }
        }

        stage('SonarQUbe:Quality Gate') {
            when{
                expression {!params.SKIP_TESTS}
            }
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }


        stage('Docker Build Images') {
            steps {
                sh "echo ${env.DOCKER_CREDS_PSW} | docker login -u ${env.DOCKER_CREDS_USR} --password-stdin"

                parallel (
                    backend: {
                        dir('backend') {
                            docker_build('interviewer-backend', params.BACKEND_DOCKER_TAG, env.DOCKER_CREDS_USR)
                        }
                    
                    },
                    frontend: {
                        dir('frontend') {
                            docker_build('interviewer-frontend', params.FRONTEND_DOCKER_TAG, env.DOCKER_CREDS_USR)
                        }
                    }
                )
            }
        }

        stage('Trivy: Image Scan') {
            when {
                expression { !params.SKIP_TESTS }
            }
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    sh """
                        trivy image --exit-code 0 --severity HIGH,CRITICAL \
                          --format template --template "@contrib/html.tpl" \
                          -o trivy-backend-report.html \
                          ${env.IMAGE_BACKEND}:${params.BACKEND_DOCKER_TAG}

                        trivy image --exit-code 0 --severity HIGH,CRITICAL \
                          --format template --template "@contrib/html.tpl" \
                          -o trivy-frontend-report.html \
                          ${env.IMAGE_FRONTEND}:${params.FRONTEND_DOCKER_TAG}
                    """
                    publishHTML(target: [
                        reportDir: '.', reportFiles: 'trivy-backend-report.html,trivy-frontend-report.html',
                        reportName: 'Trivy Image Scan Report', keepAll: true
                    ])
                }
            }
        }
        
        stage('Docker: Push Image') {
            steps {
            
                docker_push('interviewer-backend', params.BACKEND_DOCKER_TAG, env.DOCKER_CREDS_USR)
                docker_push('interviewer-frontend', params.FRONTEND_DOCKER_TAG, env.DOCKER_CREDS_USR)
           
            }
        }


        stage('Docker: Cleanup Local Images') {
            steps {
                sh """
                    docker rmi ${env.IMAGE_BACKEND}:${params.BACKEND_DOCKER_TAG}  || true
                    docker rmi ${env.IMAGE_FRONTEND}:${params.FRONTEND_DOCKER_TAG} || true
                """
            }
        }




        

    }

    post {
        success {
            archiveArtifacts artifacts: '*.xml, *.html', followSymlinks: false

            slackSend(
                channel: '#deployments',
                color: 'good',
                message: """✅ *CI PASSED* — Interviewer [${params.ENVIRONMENT.toUpperCase()}]
                > Frontend: `${params.FRONTEND_DOCKER_TAG}` | Backend: `${params.BACKEND_DOCKER_TAG}`
                > Build: <${env.BUILD_URL}|#${env.BUILD_NUMBER}>"""
            )

            build job: 'Interviewer-CD', wait: false, parameters: [
                string(name: 'FRONTEND_DOCKER_TAG', value: params.FRONTEND_DOCKER_TAG),
                string(name: 'BACKEND_DOCKER_TAG',  value: params.BACKEND_DOCKER_TAG),
                string(name: 'ENVIRONMENT',          value: params.ENVIRONMENT)
            ]
        }

        failure {
            slackSend(
                channel: '#deployments',
                color: 'danger',
                message: """❌ *CI FAILED* — Interviewer [${params.ENVIRONMENT.toUpperCase()}]
                > Build: <${env.BUILD_URL}|#${env.BUILD_NUMBER}>"""
            )
            emailext(
                attachLog: true,
                from: 'maharapratik5@gmail.com',
                to: 'maharapratik5@gmail.com',
                subject: "❌ CI FAILED — Interviewer #${env.BUILD_NUMBER}",
                mimeType: 'text/html',
                body: "<b>Job:</b> ${env.JOB_NAME}<br><b>Build:</b> ${env.BUILD_NUMBER}<br><b>URL:</b> ${env.BUILD_URL}"
            )
        }

        always {
            sh 'docker logout || true'
            cleanWs()
        }
    }

}

