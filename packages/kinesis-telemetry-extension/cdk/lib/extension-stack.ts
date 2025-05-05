import { Stack, StackProps, ScopedAws, RemovalPolicy } from 'aws-cdk-lib';
import { Effect, ManagedPolicy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Stream } from 'aws-cdk-lib/aws-kinesis';
import { Architecture, Code, LayerVersion, LoggingFormat, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { resolve } from 'path';

export interface TelemetryApiExtensionStackProps extends StackProps {
  extensionName: string,
  streamName: string,
  description?: string
}

export class TelemetryApiKinesisExtensionStack extends Stack {

  constructor(scope: Construct, id: string, props: TelemetryApiExtensionStackProps) {
    super(scope, id, props);

    const kinesis = new Stream(this, 'TelemetryStream', { 
      streamName: props.streamName,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    
    const extension = new LayerVersion(this, 'kinesis-telemetry-api-extension', {
      layerVersionName: `${props?.extensionName}`,
      code: Code.fromAsset(resolve(process.cwd(), `build`)),
      compatibleArchitectures: [
        Architecture.X86_64,
        Architecture.ARM_64
      ],
      compatibleRuntimes: [
        Runtime.NODEJS_20_X,
        Runtime.NODEJS_22_X,
      ],
      description: props?.extensionName
    });

    const functionName = `${this.stackName}-temp-nodejs20-function`;
    new Function(this, 'LambdaFunction', {
      functionName,
      runtime: Runtime.NODEJS_22_X,
      handler: 'index.handler',
      loggingFormat: LoggingFormat.JSON,
      code: Code.fromInline("module.exports.handler = async(event = {}) => { console.log('event :', event); }"),
      layers: [ 
        LayerVersion.fromLayerVersionArn(this, 'ExtensionArn', extension.layerVersionArn) 
      ],
      logGroup: new LogGroup(this, 'LogGroup', {
        logGroupName: `/aws/lambda/${functionName}`,
        retention: 1,
        removalPolicy: RemovalPolicy.DESTROY
      }),
    });

    const kinesisManagedPolicy = new ManagedPolicy(this, 'kinesis-telemetry-api-extension-managed-policy', {
      managedPolicyName: `${props?.extensionName}-runtime`,
      statements: [
        new PolicyStatement({
          actions: [
            'kinesis:PutRecord',
            'kinesis:PutRecords'
          ],
          resources: [ 
            kinesis.streamArn 
          ],
          effect: Effect.ALLOW
        }),
        new PolicyStatement({
          actions: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents'
          ],
          resources: [
            'arn:aws:logs:*:*:*'
          ],
          effect: Effect.ALLOW
        })
      ]
    })

    new StringParameter(this, `kinesis-telemetry-api-extension-arn-param`, {
      parameterName: `/telemetry/kinesis/extension/arn`,
      stringValue: extension.layerVersionArn,
    });
    
    new StringParameter(this, `kinesis-telemetry-api-extension-policy-arn-param`, {
      parameterName: `/telemetry/kinesis/runtime/policy/arn`,
      stringValue: kinesisManagedPolicy.managedPolicyArn
    });
  }
}
