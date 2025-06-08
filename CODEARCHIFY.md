## 📖 Context

The provided code is part of an AWS CDK (Cloud Development Kit) application that sets up a Kinesis stream and a Lambda function with a custom runtime extension. The purpose of this application is to extend the functionality of the Lambda function by adding a telemetry API that can be used to send data to the Kinesis stream.

The application uses the following notable services and libraries:
- AWS Kinesis for storing the telemetry data
- AWS Lambda for running the custom runtime extension
- AWS CDK for infrastructure as code (IaC)
- `aws-sdk` and `@aws-sdk/client-kinesis` for interacting with AWS services
- `undici` for making HTTP requests

## 📖 Overview

The architecture of this application consists of the following key components:

1. **Kinesis Stream**: A Kinesis stream named `telemetry-kinesis-stream` is created to store the telemetry data.
2. **Lambda Function**: A Lambda function is created with a custom runtime extension. The extension is responsible for registering with the Lambda runtime, receiving events, and dispatching telemetry data to the Kinesis stream.
3. **Telemetry API Extension**: The custom runtime extension is implemented as a LayerVersion in the CDK stack. It provides the necessary functionality to interact with the Lambda runtime and the Kinesis stream.
4. **Telemetry Dispatcher**: The `telemetry-dispatcher` module is responsible for sending the telemetry data to the Kinesis stream.
5. **Telemetry Listener**: The `telemetry-listener` module is responsible for receiving and buffering the telemetry events from the Lambda runtime.

The interaction between these components can be summarized as follows:

1. The Lambda function is invoked, and the custom runtime extension is loaded.
2. The extension registers with the Lambda runtime and starts listening for events.
3. When an `INVOKE` event is received, the extension dispatches the buffered telemetry data to the Kinesis stream using the `telemetry-dispatcher` module.
4. When a `SHUTDOWN` event is received, the extension immediately dispatches any remaining telemetry data and exits.

The application uses the following design patterns and architectural decisions:

- **Event-Driven Architecture (EDA)**: The custom runtime extension is designed to be event-driven, responding to `INVOKE` and `SHUTDOWN` events from the Lambda runtime.
- **Buffering and Batching**: The telemetry data is buffered in memory and dispatched in batches to the Kinesis stream to optimize performance and reduce the number of API calls.
- **Retry Mechanism**: The Kinesis client is configured with a maximum number of retries to handle temporary failures when sending data to the stream.

## 🔹 Components

| Component | Description | Interacts With | Purpose |
| --------- | ----------- | -------------- | ------- |
| Kinesis Stream | A Kinesis stream that stores the telemetry data. | Telemetry Dispatcher | Provides a durable storage for the telemetry data. |
| Lambda Function | A Lambda function that runs the custom runtime extension. | Telemetry API Extension | Provides the main execution environment for the telemetry extension. |
| Telemetry API Extension | A custom runtime extension that registers with the Lambda runtime, receives events, and dispatches telemetry data. | Lambda Function, Telemetry Listener, Telemetry Dispatcher | Extends the functionality of the Lambda function by adding telemetry capabilities. |
| Telemetry Listener | A module that receives and buffers the telemetry events from the Lambda runtime. | Telemetry API Extension | Responsible for collecting and buffering the telemetry data. |
| Telemetry Dispatcher | A module that sends the buffered telemetry data to the Kinesis stream. | Kinesis Stream | Responsible for dispatching the telemetry data to the Kinesis stream. |

## 🧱 Technologies

| Category | Technology | Purpose |
| -------- | ---------- | ------- |
| Programming Language | TypeScript | Provides type safety and modern language features for the application. |
| Framework | AWS CDK | Enables infrastructure as code (IaC) for the AWS resources. |
| AWS Services | Kinesis, Lambda | Provide the core functionality for the telemetry extension. |
| Libraries | `aws-sdk`, `@aws-sdk/client-kinesis`, `undici` | Facilitate interaction with AWS services and make HTTP requests. |

## 🔹 New Code Analysis

The new code provided contains additional functionality for the Telemetry API Extension and the Telemetry Listener components.

### Telemetry API Extension

The `subscribe` function in the `telemetry-api-extension` module is responsible for registering the extension with the Lambda runtime. It sends a `PUT` request to the Lambda runtime API with a subscription body that includes the listener URI, event types, and buffering configuration.

The function first checks if the `extensionId` and `listenerUri` are valid. If they are, it constructs the subscription body and sends the `PUT` request to the Lambda runtime API. The function handles different response statuses, logging appropriate messages based on the outcome.

### Telemetry Listener

The `telemetry-listener` module provides a `start` function that creates an HTTP server to receive telemetry data. The server listens on the `LISTENER_HOST` and `LISTENER_PORT` (default is `'sandbox'` and `4243`, respectively).

When a `POST` request is received, the server calls the `onLogReceived` function, which processes the incoming telemetry data. The telemetry data is then added to the `eventsQueue` array for further processing.

The `telemetry-dispatcher` module has been updated with a `dispatch` function that checks the `eventsQueue` and sends the buffered telemetry data to the Kinesis stream in batches. The function checks if the queue has enough items (`MAX_BATCH_RECORDS_ITEMS`) or if an immediate dispatch is requested, and then sends the data to the Kinesis stream using the `kinesis.sendsToKinesis` function.

These updates enhance the overall telemetry functionality of the application by providing a dedicated listener for receiving telemetry data and a dispatcher for sending the data to the Kinesis stream in a batched and optimized manner.

## 📝 Conclusion

The provided code is part of a well-designed AWS CDK application that extends the functionality of a Lambda function by adding a custom runtime extension for telemetry. The architecture follows best practices, such as using an event-driven design, buffering and batching telemetry data, and implementing a retry mechanism for the Kinesis stream.

The new code additions further improve the telemetry capabilities of the application by introducing a dedicated listener for receiving telemetry data and a dispatcher for sending the data to the Kinesis stream in an optimized way. These enhancements demonstrate a thoughtful and iterative approach to the application's architecture, ensuring that the telemetry functionality is robust and scalable.

Overall, the application showcases a solid architectural foundation and a commitment to improving the telemetry capabilities, which are crucial for monitoring and observability in a serverless environment.