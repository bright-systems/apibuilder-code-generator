import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

{{#each operations}}
const {{toClassName method}}{{capitalize ../type}} = gql`
{{#ifEq method 'GET'}}query{{else}}mutation{{/ifEq}} {{toClassName method}}{{capitalize ../type}}({{#allRequestFields . ../_root_.models ', '}}${{name}}: {{translateGraphQL type}}{{/allRequestFields}}) {
  {{toMethodName method}}{{capitalize ../type}}({{#allRequestFields . ../_root_.models ', '}}{{name}}: ${{name}}{{/allRequestFields}}) {
{{#successResponseType responses ../_root_.models}}{{#each fields}}    {{name}}{{#ifNotLast ../fields @index}}
{{/ifNotLast}}
{{/each}}{{/successResponseType}}
  }
}`

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
  }){{#hasOperation ../operations 'put'}},{{/hasOperation}}
{{/hasOperation}}
{{#hasOperation operations 'put'}}
  graphql(Put{{capitalize ../type}}, {
    props: (props) => ({
      onSave: {{toMethodName ../type}} => props.mutate({
        variables: {{toMethodName ../type}},
        optimisticResponse: () => ({ put{{capitalize ../type}}: { ...{{toMethodName ../type}}, __typename: '{{toClassName ../type}}', version: 1 } })
      })
    })
  })
{{/hasOperation}}
)

export { {{#each operations}}{{toClassName method}}{{capitalize ../type}}, {{/each}}withAppSync{{capitalize type}} }
