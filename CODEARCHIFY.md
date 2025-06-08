<output_format_with_explanations>

## 📖 Context
The provided code is an extension to the previously described AWS CDK application that sets up an AWS Lambda extension for processing telemetry data. This new code focuses on the implementation of the Telemetry Listener and Telemetry Dispatcher components.

## 📖 Overview
The updated architecture includes the following key components:

1. **Telemetry Listener**: This component is responsible for receiving and buffering the telemetry data from the Lambda function.
2. **Telemetry Dispatcher**: This component is responsible for dispatching the buffered telemetry data to the Kinesis stream.

The Telemetry Listener component sets up an HTTP server to receive the telemetry data from the Lambda function. It then buffers the received data in an events queue. The Telemetry Dispatcher component periodically checks the events queue and dispatches the buffered data to the Kinesis stream in batches.

## 🔹 Components

| Component | Description | Interacts With | Purpose |
| --------- | ----------- | -------------- | ------- |
| Telemetry Listener | Responsible for receiving and buffering the telemetry data. | Telemetry API Extension | Receives and buffers the telemetry data from the Lambda function. |
| Telemetry Dispatcher | Responsible for dispatching the buffered telemetry data to the Kinesis stream. | Kinesis | Sends the buffered telemetry data to the Kinesis stream. |

The Telemetry Listener component sets up an HTTP server to receive the telemetry data from the Lambda function. It listens for POST requests on the `/` endpoint and parses the incoming data. The received data is then added to the `eventsQueue` for further processing.

The Telemetry Dispatcher component exports a `dispatch` function that checks the `eventsQueue` and sends the buffered data to the Kinesis stream in batches. The batch size is limited to `MAX_BATCH_RECORDS_ITEMS` (5) to optimize the Kinesis put records operation. The dispatcher can be called either immediately or when the queue reaches the batch size.

## 🧱 Technologies

| Category | Technology | Purpose |
| -------- | ---------- | ------- |
| Networking | HTTP | Provides the communication channel between the Lambda extension and the Telemetry Listener. |
| Streaming | AWS Kinesis | Stores the telemetry data. |
| Logging | Console | Provides logging functionality for the extension and listener components. |

</output_format_with_explanations>