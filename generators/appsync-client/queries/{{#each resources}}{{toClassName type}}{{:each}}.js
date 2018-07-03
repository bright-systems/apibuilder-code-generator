{{#*inline "responseParams"}} {
{{#each fields}}  {{repeat '  ' ../depth}}{{name}}{{#isModel . ../models}}{{> responseParams depth=(plus ../../depth 1) models=../../models}}{{/isModel}}
{{/each}}
{{repeat '  ' (plus ./depth -1)}}  }{{/inline}}
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

{{#each operations}}
const {{capitalize method}}{{toClassName ../type}} = gql`
{{#ifEq method 'GET'}}query{{else}}mutation{{/ifEq}} {{capitalize method}}{{toClassName ../type}}({{#ifEmpty body}}{{else}}${{toMethodName body.type}}: {{toClassName body.type}}Input! {{#ifNotEmpty parameters}}, {{/ifNotEmpty}}{{/ifEmpty}}{{#each parameters}}${{toMethodName name}}: {{translateGraphQL type ../../_root_.enums ../../_root_.models false}}{{#ifNotLast ../parameters @index}}, {{/ifNotLast}}{{/each}}) {
  {{toLowerCase method}}{{toClassName ../type}}({{#ifEmpty body}}{{else}}{{toMethodName body.type}}: ${{toMethodName body.type}}{{#ifNotEmpty parameters}}, {{/ifNotEmpty}}{{/ifEmpty}}{{#each parameters}}{{toMethodName name}}: ${{toMethodName name}}{{#ifNotLast ../parameters @index}}, {{/ifNotLast}}{{/each}}){{#successResponseType responses ../_root_.models}}{{> responseParams depth=1 models=../../_root_.models}}{{/successResponseType}}
}`

{{/each}}
const withAppSync{{toClassName type}} = compose(
{{#hasOperation operations 'get'}}
  graphql(Get{{toClassName ../type}}, {
    name: 'get{{toClassName ../type}}',
    options: (ownProps) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
{{#each parameters}}
        {{toMethodName name}}: ownProps.{{toMethodName name}}{{#ifNotLast ../parameters @index}},{{/ifNotLast}}
{{/each}}
      }
    }),
    props: (props) => {
      if (props.get{{toClassName ../type}}.error) console.log(props.get{{toClassName ../type}}.error)
      return props
    }
  }){{#hasOperation ../operations 'put'}},{{/hasOperation}}
{{/hasOperation}}
{{#hasOperation operations 'put'}}
  graphql(Put{{toClassName ../type}}, {
    props: (props) => ({
      put{{toClassName ../type}}: ownProps => props.mutate({
        variables: {
{{#ifEmpty body}}{{else}}
          {{toMethodName body.type}}: ownProps.{{toMethodName body.type}}{{#ifNotEmpty parameters}},{{/ifNotEmpty}}
{{/ifEmpty}}
{{#each parameters}}
          {{toMethodName name}}: ownProps.{{toMethodName name}}{{#ifNotLast ../parameters @index}},{{/ifNotLast}}
{{/each}}
        },
        optimisticResponse: () => ({ put{{toClassName ../type}}: { ...ownProps.{{toMethodName ../type}}, __typename: '{{toClassName ../type}}', version: 1 } })
      })
    })
  }){{#hasOperation ../operations 'delete'}},{{/hasOperation}}
{{/hasOperation}}
{{#hasOperation operations 'delete'}}
  graphql(Delete{{toClassName ../type}}, {
    props: (props) => ({
      delete{{toClassName ../type}}: ownProps => props.mutate({
        variables: {
{{#ifEmpty body}}{{else}}
          {{toMethodName body.type}}: ownProps.{{toMethodName body.type}}{{#ifNotEmpty parameters}},{{/ifNotEmpty}}
{{/ifEmpty}}
{{#each parameters}}
          {{toMethodName name}}: ownProps.{{toMethodName name}}{{#ifNotLast ../parameters @index}},{{/ifNotLast}}
{{/each}}
        },
        optimisticResponse: () => ({ delete{{toClassName ../type}}: { ...ownProps, __typename: '{{toClassName ../type}}', version: 1 } })
      })
    })
  })
{{/hasOperation}}
)

export { {{#each operations}}{{capitalize method}}{{toClassName ../type}}, {{/each}}withAppSync{{toClassName type}} }
