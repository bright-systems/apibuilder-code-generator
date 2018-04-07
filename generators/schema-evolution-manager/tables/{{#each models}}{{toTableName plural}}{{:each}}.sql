create table {{toTableName plural}} {
{{#each fields}}
  {{#ifReservedWord name "postgres"}}`{{name}}`{{else}}{{toSnakeCase name}}{{/ifReservedWord}} {{columnDefinition . ../_root_.enums}}{{#ifNotLast ../fields @index}},{{/ifNotLast}}
{{/each}}
}

{{#each fields}}
{{#ifEmpty description}}
{{else}}comment on column {{toTableName ../plural}}.{{name}} is '
  {{description}}
';
{{/ifEmpty}}
{{/each}}
