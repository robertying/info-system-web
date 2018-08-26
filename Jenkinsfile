pipeline {
  agent {
    docker {
      image 'node:10-alpine'
      args '-p 4000:4000'
    }

  }
  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Archive') {
      steps {
        archiveArtifacts(artifacts: 'build/**/*.*', onlyIfSuccessful: true)
      }
    }
  }
}