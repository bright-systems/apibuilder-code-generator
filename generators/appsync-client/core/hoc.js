import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { Rehydrated } from 'aws-appsync-react'

const withApollo = (Comp, getClientFunc) => {
  class Wrapper extends Component {
    render() {
      const client = getClientFunc()
      return (
        <ApolloProvider client={client}>
          <Rehydrated>
            <Comp {...this.props} />
          </Rehydrated>
        </ApolloProvider>
      )
    }
  }
  return Wrapper
}

export { withApollo }
