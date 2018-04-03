# apibuilder-code-generator
A set of code generators for [apibuilder.io]

## Deployment
TBD, but the intention is to deploy this to AWS Lambda behind API Gateway.

Until there is a better process:
```
  rm -rf node_modules
  npm install --production
  zip -r apibuilder-code-generator.zip . -x *.git* -x *apibuilder-code-generator.zip* -x cloud_formation/\* -x *aws-sdk*
```
Then upload the .zip files to the two Lambda functions.


## Development

### Run locally
This can be run locally in conjunction with the API Builder applications. To run API Builder
locally, do the following to setup.

#### Prerequisites
1. Postgresql (`brew install psql`)
2. Schema Evolution Manager (follow instructions at https://github.com/mbryzek/schema-evolution-manager)
3. sbt

#### Setup API Builder
```
cd $YOUR_ROOT_APP_DIRECTORY
git clone git@github.com:apicollective/apibuilder.git
git clone git@github.com:apicollective/apibuilder-generator.git
git clone git@github.com:apicollective/apibuilder-postgresql.git
git clone git@github.com:apicollective/apibuilder-cli.git
cd apibuilder-postgresql
./install.sh
```

#### To run:
```
# window 1
cd $YOUR_ROOT_APP_DIRECTORY/apibuilder
sbt "api/run 9001"

# window 2
cd $YOUR_ROOT_APP_DIRECTORY/apibuilder
CONF_APIBUILDER_GITHUB_OAUTH_CLIENT_SECRET={secret key here} sbt "app/run 9000"

# window 3
cd $YOUR_ROOT_APP_DIRECTORY/apibuilder-generator
sbt "generator/run 9002"

# window 4
cd $YOUR_ROOT_APP_DIRECTORY/apibuilder-code-generator
node localServer.js 9003 # alternatively: npm run-script local-server
```

#### One-time setup
Once the app is running, you will need to upload some sample API specs (to get some data into the database).
You'll also need to add the generators by pointing to http://localhost:9003. Once this is complete, you can
test generators by either using the UI or the `apibuilder` cli (the latter is probably preferred - see that
repo for instructions on how to use it and how to refer to the local instance).


## Hacks
1. Can't use '/' in filenames and thus cannot properly close a `{{/each}}`
2. Pass the full service document as `__root__`