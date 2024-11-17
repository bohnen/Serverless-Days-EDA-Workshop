import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface S3BucketStackProps extends cdk.StackProps {
    readonly bucketName: string;
}

export class S3BucketStack extends cdk.Stack {
  public readonly bucket: cdk.aws_s3.Bucket;
  constructor(scope: Construct, id: string, props: S3BucketStackProps) {
    super(scope, id, props);

    const s3Bucket = new cdk.aws_s3.Bucket(this, 'S3Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: props.bucketName,
      eventBridgeEnabled: true,
    });

    this.bucket = s3Bucket;

    // create iam user to access the s3 bucket
    const s3User = new cdk.aws_iam.User(this, 'S3AccessUser', {
        userName: `${props.bucketName}-user`,
    });

    s3Bucket.grantReadWrite(s3User);
    
    // create a policy to read access of the s3 bucket
    const s3ReadPolicy = new cdk.aws_iam.PolicyDocument({
      statements: [new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ['s3:GetObject','s3:GetObjectVersion'],
        resources: [s3Bucket.arnForObjects('*')],
      }),new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ['s3:ListBucket','s3:GetBucketLocation'],
        resources: [s3Bucket.bucketArn],
      })],
    });

    // create a role to read access of the s3 bucket, assumed by specified AWS account
    const role = new cdk.aws_iam.Role(this, 'AwsSetupRole', {
      assumedBy: new cdk.aws_iam.AnyPrincipal(),
      inlinePolicies: {
        's3-read-policy': s3ReadPolicy,
      },
    });

    // outut the role ARN
    new cdk.CfnOutput(this, 'AwsSetupRoleArn', {
      value: role.roleArn,
    });

    // output the bucket url
    new cdk.CfnOutput(this, 'AwsSetupBucketArn', {
      value: "s3://" + s3Bucket.bucketName,
    });
  }
}