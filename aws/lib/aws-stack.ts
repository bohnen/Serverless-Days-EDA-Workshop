import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
interface AwsStackProps extends cdk.StackProps {
  readonly apiKeySecret: string;
}

export class AwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsStackProps) {
    super(scope, id, props);

    // create secret key in secrets manager
    const secret = new secretsmanager.Secret(this, 'ApiKeySecret', {
      secretName: props.apiKeySecret,
    });
  }
}
