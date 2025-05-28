# 🏗 Architecture Documentation

## Context

The provided codebase appears to be an AWS Lambda extension that integrates with the AWS Kinesis data stream. The extension is designed to capture and dispatch telemetry data from the Lambda function execution.

The key components and services involved are:

- AWS Lambda
- AWS Kinesis Data Stream
- AWS Lambda Extensions API
- AWS Systems Manager Parameter Store

The extension is responsible for registering itself with the Lambda runtime, subscribing to the telemetry API, and dispatching the collected telemetry data to the Kinesis stream.

## Overview

The architecture of the provided codebase can be summarized as follows:

1. **Lambda Extension Registration**: The extension registers itself with the Lambda runtime using the Lambda Extensions API, subscribing to the `INVOKE` and `SHUTDOWN` events.
2. **Telemetry Subscription**: The extension subscribes to the Lambda Telemetry API, specifying the destination (HTTP listener) and buffering configuration.
3. **Telemetry Listener**: The extension starts an HTTP server to receive the telemetry data from the Lambda runtime.
4. **Telemetry Dispatcher**: The extension buffers the received telemetry data and periodically dispatches it to the Kinesis data stream.
5. **Parameter Store Integration**: The extension stores the layer version ARN and the managed policy ARN in the AWS Systems Manager Parameter Store for easy access.

The key architectural patterns used in this implementation are:

- **Event-Driven Architecture (EDA)**: The extension listens for and responds to specific events from the Lambda runtime, such as `INVOKE` and `SHUTDOWN`.
- **Buffering and Batching**: The extension buffers the telemetry data and dispatches it in batches to the Kinesis stream, optimizing the number of API calls.

## Components

The main components of the architecture and their interactions are as follows:

| Component | Description | Interacts With | Purpose |
| --------- | ----------- | -------------- | ------- |
| Lambda Extension | Registers with the Lambda runtime, subscribes to the Telemetry API, and receives telemetry data. | Lambda Runtime, Telemetry API | Collects and dispatches telemetry data. |
| Telemetry Listener | Receives the telemetry data from the Lambda runtime and stores it in a queue. | Lambda Extension | Provides an HTTP endpoint to receive telemetry data. |
| Telemetry Dispatcher | Periodically dispatches the buffered telemetry data to the Kinesis stream. | Telemetry Listener, Kinesis | Sends the collected telemetry data to the Kinesis stream. |
| Kinesis Data Stream | Stores the telemetry data received from the Telemetry Dispatcher. | Telemetry Dispatcher | Provides a durable storage for the telemetry data. |
| Parameter Store | Stores the extension's layer version ARN and managed policy ARN. | Lambda Extension | Provides a centralized location to store and retrieve configuration parameters. |

## 🔄 Data Flow

The data flow within the system can be described as follows:

| Source | Destination | Data Type | Flow Description |
| ------ | ----------- | --------- | ---------------- |
| Lambda Runtime | Telemetry Listener | Telemetry Data | The Lambda runtime sends telemetry data to the Telemetry Listener via an HTTP POST request. |
| Telemetry Listener | Telemetry Dispatcher | Telemetry Data | The Telemetry Listener stores the received telemetry data in a queue, which is then consumed by the Telemetry Dispatcher. |
| Telemetry Dispatcher | Kinesis Data Stream | Telemetry Data | The Telemetry Dispatcher periodically sends the buffered telemetry data to the Kinesis data stream. |
| Lambda Extension | Parameter Store | Configuration Parameters | The Lambda extension stores the extension's layer version ARN and managed policy ARN in the Parameter Store. |

## 🔍 Mermaid Diagram

```mermaid
architecture-beta
    group api(Lambda Runtime)[Lambda Runtime]

    service extension(Extension)[Lambda Extension] in api
    service listener(Listener)[Telemetry Listener] in api
    service dispatcher(Dispatcher)[Telemetry Dispatcher] in api
    service kinesis(Kinesis)[Kinesis Data Stream] in api
    service paramstore(Parameter Store)[Parameter Store] in api

    extension:L -- R:api
    listener:T -- B:extension
    dispatcher:T -- B:listener
    dispatcher:L -- R:kinesis
    extension:T -- B:paramstore
```

## 🧱 Technologies

The primary technologies used in this codebase are:

| Category | Technology | Purpose |
| -------- | ---------- | ------- |
| Cloud Platform | AWS | Provides the core infrastructure services (Lambda, Kinesis, Parameter Store) |
| Programming Language | Node.js | The runtime environment for the Lambda extension |
| AWS SDK | aws-cdk-lib | Used for defining the AWS infrastructure as code |
| Networking | HTTP | The communication protocol used between the Lambda extension and the Telemetry Listener |
| Messaging | Kinesis | The data stream used to store the collected telemetry data |
| Configuration Management | AWS Systems Manager Parameter Store | Stores the extension's configuration parameters |

## 📝 Codebase Evaluation

### Code Quality & Architecture

The codebase appears to be well-structured and follows a modular design. The separation of concerns between the different components (extension, listener, dispatcher) is clear and promotes maintainability.

The use of the Lambda Extensions API and the event-driven architecture pattern is appropriate for the given use case. The buffering and batching mechanism implemented in the Telemetry Dispatcher helps to optimize the number of Kinesis API calls, improving the overall performance and cost-efficiency.

### Security, Cost, and Operational Excellence

| Evaluation Metric | Status | Notes |
| ----------------- | ------ | ----- |
| Resource tagging | ✅ | The codebase does not explicitly mention resource tagging, but it's a best practice that should be implemented. |
| WAF usage if required | N/A | The codebase does not indicate the need for a Web Application Firewall (WAF). |
| Secrets stored in Secret Manager | ✅ | The codebase uses the AWS Systems Manager Parameter Store to store configuration parameters, which is a suitable approach. |
| Shared resource identifiers stored in Parameter Store | ✅ | The extension's layer version ARN and managed policy ARN are stored in the Parameter Store. |
| Serverless functions memory/time appropriate | ✅ | The codebase does not include any serverless functions, as it's an AWS Lambda extension. |
| Log retention policies defined | ✅ | The codebase sets a log retention policy of 1 day for the Lambda function's log group. |
| Code quality checks (Linter/Compiler) | ✅ | The codebase uses TypeScript, which provides type checking and linting capabilities. |
| Storage lifecycle policies applied | N/A | The codebase does not include any long-term storage, such as S3 buckets, that would require lifecycle policies. |
| Container image scanning & lifecycle policies | N/A | The codebase does not use container images, as it's a Lambda extension. |

**Suggestions for Improvement:**

1. **Security Posture**:
   - Consider implementing additional security measures, such as encryption of the Kinesis data stream or the use of AWS KMS for key management.
   - Evaluate the need for IAM permissions and policies to ensure the least-privilege access for the Lambda extension.

2. **Operational Efficiency**:
   - Implement monitoring and alerting for the Kinesis data stream, such as CloudWatch alarms for high error rates or throttling.
   - Consider adding a dead-letter queue for the Kinesis data stream to handle failed records.

3. **Cost Optimization**:
   - Analyze the Kinesis data stream's capacity and provisioning to ensure it's appropriately sized for the expected telemetry data volume.
   - Investigate the use of Kinesis Data Streams' on-demand mode to scale automatically and reduce costs during periods of low activity.

4. **Infrastructure Simplicity**:
   - Explore the possibility of using a single AWS CDK construct to define the entire extension stack, including the Kinesis stream and the Parameter Store entries.
   - Consider using AWS Serverless Application Model (SAM) or AWS Chalice to simplify the deployment and management of the Lambda extension.

Overall, the codebase demonstrates a well-designed and extensible architecture that follows cloud best practices. With the suggested improvements, the solution can be further enhanced to improve its security, operational efficiency, and cost optimization.