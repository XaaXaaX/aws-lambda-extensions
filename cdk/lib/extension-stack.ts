import { Stack, StackProps, ScopedAws, RemovalPolicy } from 'aws-cdk-lib';
import { Effect, ManagedPolicy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, Code, LayerVersion, LoggingFormat, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import path = require('path');

export interface TelemetryApiExtensionStackProps extends StackProps {
  extensionName: string,
  streamName: string,
  description?: string
}

export class TelemetryApiKinesisExtensionStack extends Stack {

  constructor(scope: Construct, id: string, props: TelemetryApiExtensionStackProps) {
    super(scope, id, props);

    const { region: REGION, accountId: ACCOUNT_ID } = new ScopedAws(this);

    const extension = new LayerVersion(this, 'kinesis-telemetry-api-extension', {
      layerVersionName: `${props?.extensionName}`,
      code: Code.fromAsset(path.resolve(`../src/build`)),
      compatibleArchitectures: [
        Architecture.X86_64,
        Architecture.ARM_64
      ],
      compatibleRuntimes: [
        Runtime.NODEJS_18_X,
        Runtime.NODEJS_20_X,
        Runtime.PYTHON_3_12
      ],
      description: props?.extensionName
    });

    const functionName = `${this.stackName}-temp-nodejs20-function`;
    new Function(this, 'LambdaFunction', {
      functionName,
      runtime: Runtime.NODEJS_20_X,
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
          resources: [ `arn:aws:kinesis:${REGION}:${ACCOUNT_ID}:stream/${props.streamName}` ],
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

    const telemetryExtensionArnParam = new StringParameter(this, `kinesis-telemetry-api-extension-arn-param`, {
      parameterName: `/telemetry/kinesis/extension/arn`,
      stringValue: extension.layerVersionArn,
    });
    
    const telemetryExtensionRuntimePolicyArnParam =new StringParameter(this, `kinesis-telemetry-api-extension-policy-arn-param`, {
      parameterName: `/telemetry/kinesis/runtime/policy/arn`,
      stringValue: kinesisManagedPolicy.managedPolicyArn
    });
    const telemetryExtensionBuildPolicyArnParam = new StringParameter(this, `kinesis-telemetry-api-extension-build-policy-arn-param`, {
      parameterName: `/telemetry/kinesis/build/policy/arn`,
      stringValue: `arn:aws:iam::${ACCOUNT_ID}:policy/${props?.extensionName}-build`
    });

    new ManagedPolicy(this, 'telemetry-api-extension-buildtime-managed-policy', {
      managedPolicyName: `${props?.extensionName}-build`,
      statements: [
        new PolicyStatement({
          actions: [
            'ssm:Get*'
          ],
          resources: [ 
            telemetryExtensionArnParam.parameterArn,
            telemetryExtensionRuntimePolicyArnParam.parameterArn,
            telemetryExtensionBuildPolicyArnParam.parameterArn
          ],
          effect: Effect.ALLOW
        })
      ]
    });
  }
}
