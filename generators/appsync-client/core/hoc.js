const withApollo = (Comp, getClientFunc) => {
  class Wrapper extends Component {
    render() {
      const client = getClientFunc()
      return (
        <ApolloProvider client={client}>
          <Rehydrated>
            <Comp />
          </Rehydrated>
        </ApolloProvider>
      )
    }
  }
  return Wrapper
}

export withApollo
