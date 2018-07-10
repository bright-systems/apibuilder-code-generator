create table {{toTableName plural}} (
{{#each fields}}
  {{#ifReservedWord name "postgres"}}`{{name}}`{{else}}{{toSnakeCase name}}{{/ifReservedWord}} {{columnDefinition . ../_root_.enums}}{{#ifNotLast ../fields @index}},{{/ifNotLast}}
{{/each}}
);
{{#ifEmpty description}}
{{else}}
comment on table {{toTableName plural}} is '
  {{description}}
';
{{/ifEmpty}}

{{#each fields}}
{{#ifEmpty description}}
{{else}}comment on column {{toTableName ../plural}}.{{toSnakeCase name}} is '
  {{description}}
';
{{/ifEmpty}}
{{/each}}
