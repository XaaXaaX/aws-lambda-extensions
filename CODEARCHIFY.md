## 📖 Context
* Explain the goal of the repository:
    - The repository aims to provide a Telemetry API Extension for Kinesis push, allowing for the integration of telemetry data with Amazon Kinesis streams.
* Identify used services or notable code libraries:
    - AWS CDK for infrastructure provisioning.
    - AWS services like Kinesis, Lambda, IAM, SSM for managing telemetry data.
    - Undici for HTTP client.
    - @aws-sdk/client-kinesis for interacting with Amazon Kinesis.
    - @smithy/node-http-handler for handling HTTP requests.
    - Node.js for server-side logic.

## 📖 Overview
* The architecture involves setting up a Telemetry API Extension for Kinesis push using AWS CDK.
* Key components include Kinesis stream, Lambda functions, IAM policies, LayerVersion, LogGroup, and StringParameter.
* The system interacts through API calls between Lambda functions, Kinesis stream, and external services.
* Design patterns like event-driven architecture and serverless computing are utilized.
* The new code chunk introduces functionalities for subscribing to the extension, dispatching telemetry data to Kinesis, and setting up an HTTP server for receiving telemetry logs.

## 🔹 Components  
| Component | Description | Interacts With | Purpose |
| --------- | ----------- | -------------- | ------- |
| TelemetryStream | Amazon Kinesis Stream | LambdaFunction, HTTPServer | Stores telemetry data and receives telemetry logs |
| LambdaFunction | AWS Lambda Function | TelemetryStream, LayerVersion, LogGroup | Processes telemetry data |
| LayerVersion | AWS Lambda Layer | LambdaFunction | Contains shared code for Lambda functions |
| LogGroup | AWS CloudWatch Logs | LambdaFunction | Stores logs for monitoring |
| StringParameter | AWS Systems Manager | - | Stores parameter values |
| ManagedPolicy | AWS IAM Policy | KinesisStream | Defines permissions for Kinesis operations |
| HTTPServer | Node.js HTTP Server | TelemetryStream | Receives telemetry logs from external sources |

## 🧱 Technologies
| Category | Technology | Purpose |
| -------- | ---------- | ------- |
| Framework | AWS CDK | Infrastructure as Code |
| Library | @aws-sdk/client-kinesis | Interacting with Amazon Kinesis |
| Library | @smithy/node-http-handler | Handling HTTP requests |
| Library | Undici | HTTP client |
| Language | Node.js | Server-side logic |

The architecture now includes components for handling subscription to the extension, dispatching telemetry data to Kinesis, and receiving telemetry logs via an HTTP server. These additions enhance the functionality of the Telemetry API Extension for Kinesis push.