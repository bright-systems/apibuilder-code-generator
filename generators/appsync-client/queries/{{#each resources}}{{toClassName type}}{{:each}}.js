{{#each operations}}
const {{toClassName method}}{{capitalize ../type}} = gql`
{{#ifEq method 'GET'}}query{{else}}mutation{{/ifEq}} {{toClassName method}}{{capitalize ../type}}({{#each parameters}}${{toMethodName name}}: {{translateGraphQL type _root_.enums}}{{#if required}}!{{/if}}{{#ifNotLast ../parameters @index}}, {{/ifNotLast}}{{/each}}) {
  {{toMethodName method}}{{capitalize ../type}}({{#each parameters}}{{toMethodName name}}: ${{toMethodName name}}{{#ifNotLast ../parameters @index}}, {{/ifNotLast}}{{/each}}) {
{{#successResponseType responses ../_root_.models}}{{#each fields}}    {{name}}{{#ifNotLast ../fields @index}}
{{/ifNotLast}}
{{/each}}{{/successResponseType}}
  }
}

{{/each}}
const withAppSync{{capitalize type}} = compose(
{{#hasOperation operations 'get'}}
  graphql(Get{{capitalize ../type}}, {
    options: (ownProps) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        id: ownProps.id
      }
    }),
    props: (props) => {
      if (props.data.loading || props.data.error) {
        return {}
      } else {
        return props.data.get{{capitalize ../type}} || {}
      }
    }
  }),
{{/hasOperation}}
{{#hasOperation operations 'put'}}
  graphql(Put{{capitalize ../type}}, {
    props: (props) => ({
      onSave: {{toMethodName ../type}} => props.mutate({
        variables: {{toMethodName ../type}},
        optimisticResponse: () => ({ put{{capitalize ../type}}: { ...{{toMethodName ../type}}, __typename: '{{toClassName ../type}}', version: 1 } })
      })
    })
  }),
{{/hasOperation}}
)
