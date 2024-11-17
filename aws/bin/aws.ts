#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { config as AppConfig } from '../env/demo';
import { AwsStack } from '../lib/aws-stack';
import { EventbridgeStack } from '../lib/eventbridge-stack';
import { S3BucketStack } from '../lib/s3-stack';

const app = new cdk.App();
new AwsStack(app, 'AwsStack', {
  apiKeySecret: AppConfig.momentoAPIKey,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
});
new S3BucketStack(app, 'S3BucketStack', {
  bucketName: AppConfig.bucketName,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
});
new EventbridgeStack(app, 'EventbridgeStack', {
  apiKeySecret: AppConfig.momentoAPIKey,
  momentoApiEndpoint: AppConfig.momentoEndpoint,
  pathParameterValue: AppConfig.momentoPath,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
});