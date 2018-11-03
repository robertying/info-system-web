pipeline {
  agent {
    docker {
      args '-p 4000:4000'
      image 'node:11-alpine'
    }

  }
  stages {
    stage('Install') {
      steps {
        sh '''npm config set unsafe-perm true
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install'''
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