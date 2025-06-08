## 📖 Context

The provided code appears to be an extension for AWS Lambda functions that collects and dispatches telemetry data to an AWS Kinesis stream. The extension is responsible for registering itself with the Lambda runtime, subscribing to telemetry events, and sending the collected data to the Kinesis stream.

The key services and components used in this architecture are:

- **AWS Lambda**: The core serverless compute service that runs the application code.
- **AWS Kinesis**: A fully managed real-time data streaming service used to ingest and process large amounts of data.
- **AWS Lambda Extensions**: A feature that allows you to extend the functionality of your Lambda functions by running custom code alongside the function.

The main purpose of this repository is to provide a Kinesis-based telemetry extension for Lambda functions, allowing them to push telemetry data to a Kinesis stream for further processing or analysis.

## 📖 Overview

The architecture consists of the following key components:

1. **Telemetry API Extension**: This is the main component of the system, responsible for registering the extension with the Lambda runtime, subscribing to telemetry events, and dispatching the collected data to the Kinesis stream.
2. **Telemetry Listener**: This component is responsible for receiving and buffering the telemetry events from the Lambda function.
3. **Telemetry Dispatcher**: This component is responsible for sending the buffered telemetry data to the Kinesis stream.
4. **Kinesis Client**: This component encapsulates the logic for interacting with the AWS Kinesis service, including sending data to the Kinesis stream.

The overall flow of the system is as follows:

1. The Telemetry API Extension registers itself with the Lambda runtime and subscribes to receive telemetry events.
2. When a telemetry event is received, the Telemetry Listener buffers the event data.
3. When the Lambda function is invoked or the extension is about to be shut down, the Telemetry Dispatcher is triggered to send the buffered telemetry data to the Kinesis stream.
4. The Kinesis Client is responsible for interacting with the Kinesis service and sending the telemetry data to the configured Kinesis stream.

The architecture follows a few key design patterns and principles:

- **Event-Driven Architecture (EDA)**: The system is designed to be event-driven, with the Telemetry Listener and Telemetry Dispatcher components reacting to specific events (function invocation and shutdown) to process and dispatch the telemetry data.
- **Separation of Concerns**: The system is divided into distinct components, each with a specific responsibility, which helps to maintain modularity and maintainability.
- **Buffering and Batching**: The system buffers the telemetry data and sends it to Kinesis in batches, which helps to optimize the performance and reduce the number of API calls to Kinesis.

## 🔹 Components

| Component | Description | Interacts With | Purpose |
| --------- | ----------- | -------------- | ------- |
| Telemetry API Extension | Responsible for registering the extension with the Lambda runtime, subscribing to telemetry events, and coordinating the overall flow of the system. | Telemetry Listener, Telemetry Dispatcher, Kinesis Client | Manages the lifecycle of the extension and orchestrates the data flow. |
| Telemetry Listener | Receives and buffers the telemetry events from the Lambda function. | Telemetry API Extension, Telemetry Dispatcher | Collects and stores the telemetry data. |
| Telemetry Dispatcher | Responsible for sending the buffered telemetry data to the Kinesis stream. | Telemetry Listener, Kinesis Client | Processes and dispatches the telemetry data to Kinesis. |
| Kinesis Client | Encapsulates the logic for interacting with the AWS Kinesis service, including sending data to the Kinesis stream. | Telemetry Dispatcher | Provides an abstraction for the Kinesis service, handling the low-level details of the Kinesis API. |

## 🧱 Technologies

| Category | Technology | Purpose |
| -------- | ---------- | ------- |
| Programming Language | Node.js | The entire system is implemented in Node.js, leveraging the AWS CDK (Cloud Development Kit) and other Node.js-based libraries. |
| AWS Services | Lambda, Kinesis, SSM (Systems Manager) | The system utilizes various AWS services to implement the telemetry extension functionality. |
| Libraries/Frameworks | aws-cdk-lib, aws-lambda, aws-lambda-nodejs, aws-kinesis, aws-ssm | The system uses several AWS-specific libraries and frameworks to interact with the various AWS services. |
| Networking | HTTP, Kinesis | The system uses HTTP for communication between the extension and the Lambda runtime, and Kinesis for sending telemetry data. |

## 🔹 Components Analysis

The new code provided includes the following components:

1. **Telemetry Listener**:
   - The `Telemetry Listener` component is responsible for receiving and buffering the telemetry events from the Lambda function.
   - It creates an HTTP server that listens for POST requests, and when a request is received, it parses the request body and adds the telemetry data to the `eventsQueue`.
   - The `start()` function returns the URL of the listener, which can be used by the `Telemetry API Extension` to subscribe to the telemetry events.

2. **Telemetry Dispatcher**:
   - The `Telemetry Dispatcher` component is responsible for sending the buffered telemetry data to the Kinesis stream.
   - The `dispatch()` function checks if there are any pending items in the `eventsQueue` and, if the number of items is greater than or equal to `MAX_BATCH_RECORDS_ITEMS` or if the `immediate` parameter is `true`, it sends the data to the Kinesis stream using the `Kinesis Client`.
   - The `dispatch()` function is designed to batch the telemetry data and send it to Kinesis in larger chunks, which can help optimize performance and reduce the number of API calls.

The new code integrates seamlessly with the existing architecture, as the `Telemetry Listener` and `Telemetry Dispatcher` components work together to collect and dispatch the telemetry data to the Kinesis stream. The `Telemetry API Extension` can now use the `Telemetry Listener` to subscribe to the telemetry events and the `Telemetry Dispatcher` to send the data to Kinesis.

The overall architecture remains consistent with the previously described design patterns and principles, such as the Event-Driven Architecture (EDA) and the Separation of Concerns. The addition of the `Telemetry Listener` and `Telemetry Dispatcher` components further enhances the modularity and maintainability of the system.

## 🧱 Technologies

The new code does not introduce any new technologies beyond what was already described in the previous context. The system continues to use Node.js as the programming language, along with the various AWS services and libraries.