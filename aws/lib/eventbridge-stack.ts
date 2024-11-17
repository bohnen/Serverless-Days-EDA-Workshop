import * as cdk from "aws-cdk-lib";
import * as events from "aws-cdk-lib/aws-events";
import * as events_targets from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";
import path = require("path");

interface EventbridgeStackProps extends cdk.StackProps {
    readonly apiKeySecret: string;
    readonly momentoApiEndpoint: string;
    readonly pathParameterValue: string;
}

export class EventbridgeStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: EventbridgeStackProps) {
        super(scope, id, props);

        // Define the connection for the event bridge
        const connection = new events.Connection(this, 'momento-connection', {
            connectionName: 'momento-connection',
            authorization: events.Authorization.apiKey('Authorization', cdk.SecretValue.secretsManager(props.apiKeySecret)),
            description: 'Connection with API Key Authorization',
        });

        // Define the API destination for the topic publish operation.
        const topicApiDestination = new events.ApiDestination(this, "momento-topic-publish", {
            apiDestinationName: "momento-topic-publish",
            connection,
            endpoint: props.momentoApiEndpoint,
            description: "Topic Publish API",
            httpMethod: events.HttpMethod.POST,
        });

        // Define S3 event rule
        const S3Rule = new events.Rule(this, 'S3EventRule', {
            eventPattern: {
                source: ['aws.s3'],
            },
        });

        // Add the S3 event target
        S3Rule.addTarget(new events_targets.ApiDestination(topicApiDestination,{
            pathParameterValues: [props.pathParameterValue],
            headerParameters: {
                'Content-Type': 'text/plain',
            },
            event: events.RuleTargetInput.fromEventPath('$.detail.object.key'),
        }));
    }
}