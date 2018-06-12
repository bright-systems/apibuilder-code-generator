import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

{{#each operations}}
const {{capitalize method}}{{capitalize ../type}} = gql`
{{#ifEq method 'GET'}}query{{else}}mutation{{/ifEq}} {{capitalize method}}{{capitalize ../type}}({{#ifEmpty body}}{{else}}${{toMethodName body.type}}: {{toClassName body.type}}Input! {{#ifNotEmpty parameters}}, {{/ifNotEmpty}}{{/ifEmpty}}{{#each parameters}}${{toMethodName name}}: {{translateGraphQL type ../../_root_.enums ../../_root_.models}}{{#ifNotLast ../parameters @index}}, {{/ifNotLast}}{{/each}}) {
  {{toLowerCase method}}{{capitalize ../type}}({{#ifEmpty body}}{{else}}{{toMethodName body.type}}: ${{toMethodName body.type}}{{#ifNotEmpty parameters}}, {{/ifNotEmpty}}{{/ifEmpty}}{{#each parameters}}{{toMethodName name}}: ${{toMethodName name}}{{#ifNotLast ../parameters @index}}, {{/ifNotLast}}{{/each}}) {
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
{{#each parameters}}
        {{toMethodName name}}: ownProps.{{toMethodName name}}{{#ifNotLast ../parameters @index}},{{/ifNotLast}}
{{/each}}
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
      onSave: ownProps => props.mutate({
        variables: {
{{#ifEmpty body}}{{else}}
          {{toMethodName body.type}}: ownProps.{{toMethodName body.type}}{{#ifNotEmpty parameters}},{{/ifNotEmpty}}
{{/ifEmpty}}
{{#each parameters}}
          {{toMethodName name}}: ownProps.{{toMethodName name}}{{#ifNotLast ../parameters @index}},{{/ifNotLast}}
{{/each}}
        },
        optimisticResponse: () => ({ put{{capitalize ../type}}: { ...ownProps.{{toMethodName ../type}}, __typename: '{{toClassName ../type}}', version: 1 } })
      })
    })
  })
{{/hasOperation}}
)

export { {{#each operations}}{{capitalize method}}{{capitalize ../type}}, {{/each}}withAppSync{{capitalize type}} }
