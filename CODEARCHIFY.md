## 📖 Context
* This repository appears to be an AWS CDK project that sets up an AWS Lambda Extension for capturing telemetry data from Lambda functions and pushing it to an AWS Kinesis stream.
* It utilizes the AWS CDK library, AWS SDK for JavaScript, and the undici HTTP client library.

## 📖 Overview
* The architecture consists of the following key components:
  - A CDK stack (`TelemetryApiKinesisExtensionStack`) that provisions an AWS Kinesis stream and a Lambda Layer containing the extension code.
  - A Lambda Extension that listens for Lambda function invocation events and captures telemetry data.
  - A Kinesis client that sends the captured telemetry data to the provisioned Kinesis stream.
  - A telemetry listener that receives telemetry events from the Lambda Runtime API.
  - A telemetry dispatcher that buffers and dispatches telemetry events to the Kinesis client.

* The Lambda Extension registers itself with the Lambda Runtime API and listens for `INVOKE` and `SHUTDOWN` events. Upon receiving an `INVOKE` event, it dispatches the buffered telemetry data to the Kinesis stream. On `SHUTDOWN`, it flushes any remaining buffered data before exiting.

* The telemetry data is buffered in memory to optimize performance and reduce the number of Kinesis PutRecords calls.

* The telemetry listener component sets up an HTTP server to receive telemetry events from the Lambda Runtime API. It parses the received events and adds them to an in-memory queue (`eventsQueue`).

* The telemetry dispatcher component periodically checks the `eventsQueue` and dispatches batches of events to the Kinesis client for ingestion into the Kinesis stream.

* The extension subscribes to the Lambda Runtime API using the `subscribe` function, which sends a subscription request with the desired event types and buffering configuration.

## 🔹 Components

| Component | Description | Interacts With | Purpose |
| --------- | ----------- | -------------- | ------- |
| `TelemetryApiKinesisExtensionStack` | CDK stack that provisions the required AWS resources | AWS CDK | Deploys the Kinesis stream and Lambda Extension Layer |
| Lambda Extension | Lambda Extension code that captures telemetry data | Lambda Runtime API, Telemetry Listener, Telemetry Dispatcher | Captures and dispatches telemetry data |
| Kinesis Client | AWS SDK client for interacting with Kinesis | Kinesis stream | Sends telemetry data to the Kinesis stream |
| Telemetry Listener | Listens for telemetry events from the Lambda Runtime API | Lambda Runtime API, Telemetry Dispatcher | Receives telemetry events |
| Telemetry Dispatcher | Buffers and dispatches telemetry events | Telemetry Listener, Kinesis Client | Optimizes telemetry data delivery to Kinesis |

## 🧱 Technologies

| Category | Technology | Purpose |
| -------- | ---------- | ------- |
| Infrastructure as Code | AWS CDK | Defines and provisions AWS resources |
| Programming Language | Node.js | Implementation language |
| AWS Service | AWS Lambda | Serverless compute platform |
| AWS Service | AWS Kinesis | Streaming data ingestion and processing |
| Library | AWS SDK for JavaScript | Interacts with AWS services |
| Library | undici | HTTP client library |