# Database schema for {{name}}

## Prerequisites

  1. Install [schema-evolution-manager](https://github.com/mbryzek/schema-evolution-manager#installation).
  2. Create the database:
```
  createdb -U postgres {{toSnakeCase name ''}}_test
```

## To add a new database migration script

  1. Make sure you have head of master:
     git checkout master
     git fetch
     git rebase origin/master

  2. Create a local branch for your change
     git checkout -b tmp

  3. Create a file containing your upgrade script - e.g. new.sql

  4. Add your upgrade script
     sem-add ./new.sql
     git commit -m 'Add upgrade script to ...' scripts

  5. Push change

To upgrade your local postgresql database:

```
  sem-apply --host localhost --name {{toSnakeCase name ''}}_test --user postgres
```

or use the wrapper script:

```
  ./dev.rb
```

For more information on the schema evolution manager tools, look at
https://github.com/mbryzek/schema-evolution-manager
