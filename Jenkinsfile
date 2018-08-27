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
        sh '''npm run build
tar czf build.tar.gz build'''
      }
    }
    stage('Archive') {
      steps {
        archiveArtifacts(artifacts: 'build.tar.gz', onlyIfSuccessful: true, fingerprint: true)
      }
    }
    stage('Integration') {
      steps {
        build 'info-system-backend/master'
      }
    }
  }
}