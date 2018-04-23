# {{name}}
Node.js service hosted in AWS Lambda.

## Deployment
Changes merged to master will automatically get deployed via CodePipeline.

CodePipeline was created using this template: https://s3.amazonaws.com/com.getbright.cloudformation/lambda-pipeline.yml

If deploying without CodePipeline, the following commands will deploy:
```
aws cloudformation package \
  --profile bright \
  --template-file ./src/main/resources/sam.yml \
  --s3-bucket com.getbright.packages \
  --s3-prefix config-service \
  --output-template-file sam-packaged.yml

aws cloudformation deploy \
  --profile bright \
  --template-file sam-packaged.yml \
  --stack-name config-service \
  --capabilities CAPABILITY_IAM
```
