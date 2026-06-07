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
        SONAR_PROJECT=' interviewer'
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
                    ║  Wanderlust CI — ${params.ENVIRONMENT.toUpperCase()} Build
                    ║  Frontend : ${params.FRONTEND_DOCKER_TAG}
                    ║  Backend  : ${params.BACKEND_DOCKER_TAG}
                    ╚══════════════════════════════════════╝
                    """
                }
            }
        }

        stage('Worksspace Cleanup') {
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








        

    }

}

