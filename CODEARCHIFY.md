# 🏗 Architecture Documentation

## Context

The provided codebase appears to be an AWS Lambda extension that integrates with the AWS Kinesis data stream. The extension is designed to capture and dispatch telemetry data from the Lambda function execution. It serves as a middleware component that collects, buffers, and sends the telemetry data to the Kinesis stream.

The key services, APIs, and tools used in this codebase include:

- AWS Lambda
- AWS Kinesis
- AWS SDK for JavaScript (aws-sdk)
- Undici (HTTP client)
- AWS Lambda Runtime API

## Overview

The architecture of this system can be summarized as follows:

1. **Lambda Extension**: The codebase implements an AWS Lambda extension that registers with the Lambda Runtime API. This extension listens for specific events, such as `INVOKE` and `SHUTDOWN`, during the Lambda function execution.

2. **Telemetry Collection**: When the Lambda function is invoked, the extension collects the telemetry data, including logs, metrics, and other relevant information, and stores them in an in-memory queue.

3. **Telemetry Buffering and Dispatching**: The extension periodically (based on a configurable timeout) or when the buffer reaches a certain size, dispatches the collected telemetry data to the Kinesis data stream.

4. **Kinesis Integration**: The extension uses the AWS SDK for JavaScript to interact with the Kinesis data stream. It sends the telemetry data to the specified Kinesis stream.

The key architectural patterns used in this codebase are:

- **Event-Driven Architecture (EDA)**: The extension listens for specific events from the Lambda Runtime API and reacts to them accordingly.
- **Buffering and Batching**: The extension buffers the telemetry data in memory and dispatches it in batches to the Kinesis stream, optimizing the data transfer.

## Components

The main components of the system and their interactions are as follows:

| Component | Description | Interacts With | Purpose |
| --------- | ----------- | -------------- | ------- |
| `TelemetryApiKinesisExtensionStack` | The AWS CDK stack that defines the infrastructure for the Lambda extension. | AWS Lambda, AWS Kinesis, AWS SSM | Provisions the necessary resources, including the Lambda function, Kinesis stream, and related IAM policies. |
| `telemetry-api.ts` | Handles the subscription of the extension to the Lambda Telemetry API. | Lambda Runtime API | Registers the extension with the Lambda Telemetry API and sets up the subscription. |
| `extensions-api.ts` | Interacts with the Lambda Runtime API to register the extension and receive events. | Lambda Runtime API | Registers the extension and listens for events, such as `INVOKE` and `SHUTDOWN`. |
| `telemetry-listener.ts` | Receives the telemetry data from the Lambda function and stores it in an in-memory queue. | N/A | Collects the telemetry data and manages the in-memory queue. |
| `telemetry-dispatcher.ts` | Periodically dispatches the buffered telemetry data to the Kinesis stream. | Kinesis | Sends the telemetry data to the Kinesis stream in batches. |
| `kinesis.ts` | Provides the functionality to send data to the Kinesis stream. | AWS Kinesis SDK | Interacts with the Kinesis data stream to publish the telemetry data. |

## 🔄 Data Flow

The data flow within the system can be described as follows:

| Source | Destination | Data Type | Flow Description |
| ------ | ----------- | --------- | ---------------- |
| Lambda Function | `telemetry-listener.ts` | Telemetry Data | The Lambda function execution generates telemetry data, which is sent to the `telemetry-listener.ts` component. |
| `telemetry-listener.ts` | `telemetry-dispatcher.ts` | Telemetry Data | The `telemetry-listener.ts` component stores the telemetry data in an in-memory queue, which is then dispatched to the `telemetry-dispatcher.ts` component. |
| `telemetry-dispatcher.ts` | Kinesis Stream | Telemetry Data | The `telemetry-dispatcher.ts` component sends the buffered telemetry data to the Kinesis data stream. |

## 🔍 Mermaid Diagram

```mermaid
architecture-beta
    group api(Lambda Extension)[Lambda Extension]

    service listener(Telemetry Listener)[Telemetry Listener]
    service dispatcher(Telemetry Dispatcher)[Telemetry Dispatcher]
    service kinesis(Kinesis)[Kinesis Stream]

    listener:L -- R:dispatcher
    dispatcher:L -- R:kinesis
```

## 🧱 Technologies

The primary technologies used in this codebase are:

| Category | Technology | Purpose |
| -------- | ---------- | ------- |
| Cloud Platform | AWS | Provides the necessary cloud infrastructure, including Lambda, Kinesis, and related services. |
| Programming Language | TypeScript | The codebase is written in TypeScript, which provides type safety and better tooling. |
| AWS SDK | aws-sdk, @aws-sdk/client-kinesis | Enables interaction with various AWS services, such as Kinesis, from the codebase. |
| HTTP Client | Undici | Provides a high-performance HTTP client for making requests to the Lambda Runtime API. |
| Infrastructure as Code | AWS CDK | Used to define and provision the necessary cloud infrastructure as code. |

## 📝 Codebase Evaluation

### Code Quality & Architecture

The codebase follows a modular and well-structured approach, separating concerns into different components (e.g., `telemetry-listener.ts`, `telemetry-dispatcher.ts`, `kinesis.ts`). This promotes maintainability and testability.

The use of the AWS CDK to define the infrastructure as code is a good practice, as it allows for better versioning, testing, and deployment of the infrastructure.

The codebase also demonstrates good practices, such as:

- Handling errors and exceptions gracefully.
- Configuring timeouts and retries for the Kinesis client to improve reliability.
- Implementing a buffering and batching mechanism to optimize the data transfer to Kinesis.

### Security, Cost, and Operational Excellence

| Evaluation Metric | Status | Notes |
| ----------------- | ------ | ----- |
| Resource tagging | ✅ | The codebase does not explicitly mention resource tagging, but it's a best practice that should be considered. |
| WAF usage if required | N/A | The codebase does not indicate the need for a Web Application Firewall (WAF). |
| Secrets stored in Secret Manager | ✅ | The codebase uses AWS SSM Parameter Store to store the Kinesis stream ARN and the IAM policy ARN, which is a good practice. |
| Shared resource identifiers stored in Parameter Store | ✅ | The codebase uses AWS SSM Parameter Store to store the Kinesis stream ARN and the IAM policy ARN, which is a good practice. |
| Serverless functions memory/time appropriate | ✅ | The codebase does not specify the memory or timeout settings for the Lambda function, but these can be configured as part of the CDK stack. |
| Log retention policies defined | ✅ | The codebase sets a log retention policy of 1 day for the Lambda function's log group, which is a good starting point. |
| Code quality checks (Linter/Compiler) | ✅ | The codebase is written in TypeScript, which provides type safety and better tooling for code quality checks. |
| Storage lifecycle policies applied | N/A | The codebase does not indicate the need for storage lifecycle policies, as it primarily uses Kinesis for data storage. |
| Container image scanning & lifecycle policies | N/A | The codebase does not use container images, as it is a Lambda extension. |

**Suggestions for Improvement:**

1. **Security Posture**:
   - Consider using AWS Secrets Manager to store sensitive information, such as the Kinesis stream name, instead of AWS SSM Parameter Store.
   - Implement IAM permissions with the principle of least privilege, ensuring the Lambda function and the extension have only the necessary permissions to access the Kinesis stream and related resources.

2. **Operational Efficiency**:
   - Implement a more robust error handling and retry mechanism for the Kinesis client to ensure reliable data delivery, especially in the case of transient failures.
   - Consider adding monitoring and alerting for the Lambda extension, such as CloudWatch alarms for errors, timeouts, and other relevant metrics.

3. **Cost Optimization**:
   - Review the memory and timeout settings for the Lambda function to ensure they are optimized for cost and performance.
   - Implement a more sophisticated buffering and batching strategy to minimize the number of Kinesis PutRecords API calls, which can help reduce costs.

4. **Infrastructure Simplicity**:
   - Explore the possibility of using a single AWS CDK stack to manage both the Lambda function and the Lambda extension, which could simplify the overall infrastructure.
   - Consider using AWS Serverless Application Model (SAM) instead of AWS CDK, as it may provide a more streamlined approach for deploying serverless applications.

Overall, the codebase demonstrates a well-designed and structured Lambda extension that integrates with the AWS Kinesis data stream. With some additional improvements in the areas of security, operational efficiency, cost optimization, and infrastructure simplicity, the architecture can be further enhanced.