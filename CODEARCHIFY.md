<output_format_with_explanations>

## 📖 Context

The provided code is part of the custom runtime extension for the AWS Lambda function. The extension is responsible for registering with the Lambda runtime, receiving events, and dispatching telemetry data to the Kinesis stream.

The key components of the extension are:

1. **Telemetry API Extension**: This component is responsible for subscribing the extension to the Lambda runtime and handling the incoming telemetry events.
2. **Telemetry Listener**: This component starts a listener to receive the telemetry events and queue them for dispatch.
3. **Telemetry Dispatcher**: This component is responsible for sending the queued telemetry data to the Kinesis stream.

## 📖 Overview

The Telemetry API Extension component is responsible for subscribing the extension to the Lambda runtime. It sends a subscription request to the Lambda runtime API, providing the listener URL and the types of events the extension is interested in (in this case, "function" events).

The Telemetry Listener component starts an HTTP server that listens for incoming telemetry events. When an event is received, it is added to the `eventsQueue` for further processing.

The Telemetry Dispatcher component is responsible for dispatching the queued telemetry events to the Kinesis stream. It checks the `eventsQueue` periodically and, if the queue is not empty, it sends the events to the Kinesis stream in batches. The batch size is limited to `MAX_BATCH_RECORDS_ITEMS` to optimize the number of API calls and improve performance.

The key architectural decisions and design patterns used in this part of the extension include:

- **Event-Driven Architecture**: The extension listens for events from the Lambda runtime and processes them asynchronously.
- **Buffering and Batching**: The telemetry data is buffered and batched before being sent to the Kinesis stream, to optimize the number of API calls and improve performance.
- **Connection Management**: The application uses the `undici` library to manage the HTTP connections, setting appropriate timeouts and keepalive settings to ensure reliable and efficient communication with the Lambda runtime API.

## 🔹 Components

| Component | Description | Interacts With | Purpose |
| --------- | ----------- | -------------- | ------- |
| Telemetry API Extension | Responsible for subscribing the extension to the Lambda runtime and handling the incoming telemetry events. | Lambda Runtime | Registers the extension with the Lambda runtime and receives the telemetry events. |
| Telemetry Listener | Starts an HTTP server to receive the incoming telemetry events and queue them for dispatch. | Telemetry Dispatcher | Receives the telemetry events and adds them to the `eventsQueue`. |
| Telemetry Dispatcher | Responsible for dispatching the queued telemetry events to the Kinesis stream. | Kinesis Stream | Sends the telemetry data to the Kinesis stream in batches. |

## 🧱 Technologies

| Category | Technology | Purpose |
| -------- | ---------- | ------- |
| Programming Language | TypeScript | Implements the custom runtime extension. |
| AWS Services | AWS Lambda, AWS Kinesis | Provides the runtime environment and the storage for the telemetry data. |
| Libraries | `undici` | Manages the HTTP connections to the Lambda runtime API. |

</output_format_with_explanations>