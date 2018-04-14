create table {{toTableName name}} (
  key text primary key not null,
  created_at timestamptz not null default now()
);

{{#each values}}
insert into {{toTableName ../name}} (key) values ('{{name}}');
{{/each}}