import AWSAppSyncClient from 'aws-appsync'
import { Auth } from 'aws-amplify'
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link'

class Client {
  constructor() {
    this.client = null
  }

  configure(config) {
    this.client = new AWSAppSyncClient({
      url: config.graphqlEndpoint,
      region: config.region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials()
      }
    })
  }
}

const instance = new Client()
export default instance
