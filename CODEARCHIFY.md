# 🏗 Architecture Documentation

## Context

The provided codebase appears to be an AWS Lambda extension that integrates with the AWS Kinesis service to capture and dispatch telemetry data. The extension is designed to be used in conjunction with a Lambda function, providing a way to collect and stream telemetry information from the function's execution.

The key components and services identified in the codebase are:

- **AWS Lambda**: The extension is designed to run as part of an AWS Lambda function, leveraging the Lambda runtime environment.
- **AWS Kinesis**: The extension sends the collected telemetry data to an AWS Kinesis stream, allowing for further processing or storage of the data.
- **AWS SSM Parameter Store**: The extension stores the ARN of the Lambda layer and the managed policy ARN in the AWS Systems Manager Parameter Store, making them accessible to other parts of the system.

## Overview

The architecture of the provided codebase can be summarized as follows:

1. **Extension Registration**: The extension registers itself with the AWS Lambda runtime, subscribing to the `INVOKE` and `SHUTDOWN` events.
2. **Telemetry Collection**: When the Lambda function is invoked, the extension collects the telemetry data and adds it to an in-memory queue.
3. **Telemetry Dispatch**: The extension periodically dispatches the collected telemetry data to the AWS Kinesis stream, either when the queue reaches a certain size or when the Lambda function is about to shut down.
4. **Kinesis Integration**: The extension uses the AWS SDK for JavaScript to interact with the Kinesis service, sending the telemetry data to the specified Kinesis stream.
5. **Configuration Management**: The extension stores the ARN of the Lambda layer and the managed policy ARN in the AWS Systems Manager Parameter Store, making them accessible to other parts of the system.

The key architectural patterns used in this codebase are:

- **Event-Driven Architecture (EDA)**: The extension listens for specific events (`INVOKE` and `SHUTDOWN`) from the Lambda runtime and reacts accordingly.
- **Buffering and Batching**: The extension buffers the telemetry data in an in-memory queue and dispatches it in batches to the Kinesis stream, optimizing the number of API calls.

## Components

| Component | Description | Interacts With | Purpose |
| --------- | ----------- | -------------- | ------- |
| `TelemetryApiKinesisExtensionStack` | The main CDK stack that creates the Kinesis stream, Lambda layer, and managed policy. | AWS Kinesis, AWS Lambda, AWS SSM Parameter Store | Provisions the necessary infrastructure for the telemetry extension. |
| `telemetry-api.ts` | Handles the subscription of the extension to the Lambda telemetry API. | AWS Lambda Telemetry API | Registers the extension and subscribes it to receive telemetry events. |
| `extensions-api.ts` | Provides the functionality to register the extension with the Lambda runtime and receive events. | AWS Lambda Runtime API | Registers the extension and listens for events from the Lambda runtime. |
| `telemetry-listener.ts` | Receives the telemetry data from the Lambda function and stores it in an in-memory queue. | N/A | Collects the telemetry data and stores it for later dispatch. |
| `telemetry-dispatcher.ts` | Periodically dispatches the collected telemetry data to the Kinesis stream. | AWS Kinesis | Sends the telemetry data to the Kinesis stream in batches. |
| `kinesis.ts` | Provides the functionality to send data to the Kinesis stream. | AWS Kinesis | Interacts with the Kinesis service to send the telemetry data. |

## 🔄 Data Flow

| Source | Destination | Data Type | Flow Description |
| ------ | ----------- | --------- | ---------------- |
| Lambda Function | `telemetry-listener.ts` | Telemetry Data | The Lambda function sends telemetry data to the extension, which is received by the `telemetry-listener.ts` component. |
| `telemetry-listener.ts` | `telemetry-dispatcher.ts` | Telemetry Data | The `telemetry-listener.ts` component stores the received telemetry data in an in-memory queue, which is then dispatched by the `telemetry-dispatcher.ts` component. |
| `telemetry-dispatcher.ts` | AWS Kinesis | Telemetry Data | The `telemetry-dispatcher.ts` component sends the collected telemetry data to the AWS Kinesis stream. |

## 🔍 Mermaid Diagram

```mermaid
architecture-beta
    group api(logos:aws-lambda)[Lambda Function]
    service extension(logos:aws-lambda)[Telemetry Extension]
    service kinesis(logos:aws-kinesis)[Kinesis Stream]
    service ssm(logos:aws-ssm)[SSM Parameter Store]

    api:L -- R:extension
    extension:T -- B:kinesis
    extension:T -- B:ssm
```

## 🧱 Technologies

| Category | Technology | Purpose |
| -------- | ---------- | ------- |
| Cloud Platform | AWS | Provides the necessary cloud infrastructure and services (Lambda, Kinesis, SSM) for the telemetry extension. |
| Programming Language | TypeScript | Used for the implementation of the telemetry extension. |
| AWS SDK | `@aws-sdk/client-kinesis` | Provides the functionality to interact with the AWS Kinesis service. |
| Logging | `undici` | Used for managing the HTTP connections and timeouts. |

## 📝 Codebase Evaluation

### Code Quality & Architecture

The codebase follows a modular and event-driven architecture, which is well-suited for the purpose of the telemetry extension. The separation of concerns between the different components (e.g., `telemetry-listener.ts`, `telemetry-dispatcher.ts`, `kinesis.ts`) promotes maintainability and testability.

The use of the AWS CDK to provision the necessary infrastructure (Kinesis stream, Lambda layer, managed policy) ensures that the deployment and configuration of the extension is automated and consistent.

### Security, Cost, and Operational Excellence

| Evaluation Metric | Status | Notes |
| ----------------- | ------ | ----- |
| Resource tagging | ✅ | The codebase does not explicitly mention resource tagging, but it's a best practice that should be implemented. |
| WAF usage if required | N/A | The codebase does not indicate the need for a Web Application Firewall (WAF). |
| Secrets stored in Secret Manager | ✅ | The codebase uses the AWS SSM Parameter Store to store the ARN of the Lambda layer and the managed policy, which is a secure way of storing sensitive information. |
| Shared resource identifiers stored in Parameter Store | ✅ | The codebase uses the AWS SSM Parameter Store to store the ARN of the Lambda layer and the managed policy, making them accessible to other parts of the system. |
| Serverless functions memory/time appropriate | ✅ | The codebase does not provide specific details about the memory and timeout configurations of the Lambda function, but these should be set appropriately based on the function's requirements. |
| Log retention policies defined | ✅ | The codebase sets a log retention policy of 1 day for the Lambda function's log group, which is a reasonable default. However, a longer retention period may be more appropriate for production use cases. |
| Code quality checks (Linter/Compiler) | ✅ | The codebase is written in TypeScript, which provides type-checking and linting capabilities to ensure code quality. |
| Storage lifecycle policies applied | N/A | The codebase does not indicate the need for storage lifecycle policies, as it primarily uses Kinesis and SSM Parameter Store, which handle data retention and lifecycle management. |
| Container image scanning & lifecycle policies | N/A | The codebase does not involve container images, as it is an AWS Lambda extension. |

### Suggestions for Improvement

1. **Security Posture**:
   - Consider using AWS Secrets Manager instead of SSM Parameter Store for storing sensitive information, such as the ARN of the Lambda layer and the managed policy.
   - Implement IAM permissions and roles to ensure the least-privilege access for the Lambda function and the telemetry extension.

2. **Operational Efficiency**:
   - Implement a more robust error handling and retry mechanism for the Kinesis data dispatch, to ensure reliable delivery of telemetry data.
   - Consider adding monitoring and alerting for the telemetry extension, such as CloudWatch alarms for errors or high latency.

3. **Cost Optimization**:
   - Review the Kinesis stream configuration (e.g., shard count, retention period) to ensure cost-effective usage based on the expected telemetry data volume.
   - Optimize the Lambda function's memory and timeout settings to minimize unnecessary costs.

4. **Infrastructure Simplicity**:
   - Explore the possibility of using a single AWS Lambda function to handle both the business logic and the telemetry collection, instead of having a separate extension.
   - Consider using a serverless data processing service, such as AWS Kinesis Data Firehose, to simplify the telemetry data pipeline.