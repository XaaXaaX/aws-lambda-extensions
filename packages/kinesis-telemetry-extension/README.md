# Kinesis Telemetry Extension

## Overview

The Kinesis Telemetry Extension is an AWS Lambda Extension that captures telemetry data from Lambda functions and forwards it to Amazon Kinesis Data Streams. This extension leverages the Lambda Extensions API and Telemetry API to collect and process telemetry events during the Lambda function lifecycle.

## Architecture

### Component Diagram

```mermaid
graph TD
    subgraph "Lambda Function Environment"
        LF[Lambda Function]
        TE[Telemetry Extension]
        TL[Telemetry Listener]
        TD[Telemetry Dispatcher]
        
        LF -- "Generates telemetry" --> TL
        TL -- "Buffers events" --> TE
        TE -- "Processes events" --> TD
        TD -- "Sends data" --> Kinesis
    end
    
    subgraph "AWS Services"
        Kinesis[Kinesis Data Stream]
    end
    
    subgraph "Lambda APIs"
        EA[Extensions API]
        TA[Telemetry API]
        
        TE -- "Register/Next" --> EA
        TE -- "Subscribe" --> TA
        TA -- "Events" --> TL
    end
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant LF as Lambda Function
    participant TE as Telemetry Extension
    participant TL as Telemetry Listener
    participant TD as Telemetry Dispatcher
    participant EA as Extensions API
    participant TA as Telemetry API
    participant KDS as Kinesis Data Stream
    
    Note over TE: Extension Initialization
    TE->>EA: Register extension
    EA-->>TE: Return extension ID
    TE->>TL: Start telemetry listener
    TL-->>TE: Return listener URI
    TE->>TA: Subscribe to telemetry events
    TA-->>TE: Subscription confirmation
    
    loop Extension Lifecycle
        TE->>EA: Get next event
        
        alt Invoke Event
            EA-->>TE: INVOKE event
            LF->>TA: Generate telemetry
            TA->>TL: Forward telemetry
            TL->>TL: Queue telemetry events
            TE->>TD: Dispatch telemetry data
            TD->>KDS: Send data to Kinesis
            
        else Shutdown Event
            EA-->>TE: SHUTDOWN event
            TE->>TE: Wait for remaining telemetry
            TE->>TD: Dispatch remaining telemetry
            TD->>KDS: Send remaining data to Kinesis
            TE->>TE: Exit process
        end
    end
```

## Implementation Details

### Components

1. **Extensions API Client**: Handles registration and lifecycle events with the Lambda Extensions API
2. **Telemetry API Client**: Subscribes to and receives telemetry events from the Lambda Telemetry API
3. **Telemetry Listener**: HTTP server that receives telemetry events from the Telemetry API
4. **Telemetry Dispatcher**: Processes and sends telemetry data to Kinesis
5. **Kinesis Client**: Handles the communication with Amazon Kinesis Data Streams

### Configuration Parameters

| Parameter | Description | Default Value |
|-----------|-------------|---------------|
| `BUFFER_TIMEOUT_MS` | Timeout for buffering telemetry events | 100ms |
| `LOGS_BUFFER_MAX_BYTES` | Maximum buffer size in bytes | 256KB |
| `MAX_BUFFER_ITEMS_COUNT` | Maximum number of events in buffer | 1000 |
| `MAX_BATCH_RECORDS_ITEMS` | Threshold for dispatching events to Kinesis | 5 |
| `CONNECTION_TIMEOUT_MS` | HTTP connection timeout | 3600000ms (1 hour) |

## Infrastructure

The extension is deployed as a Lambda Layer using AWS CDK. The infrastructure includes:

1. **Lambda Layer**: Contains the extension code
2. **Kinesis Data Stream**: Destination for telemetry data
3. **IAM Managed Policy**: Grants permissions for the extension to write to Kinesis
4. **SSM Parameters**: Store the ARN of the extension layer and managed policy

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| `@aws-sdk/client-kinesis` | npm package | AWS SDK for Kinesis |
| `@smithy/node-http-handler` | npm package | HTTP handler for AWS SDK |
| `undici` | npm package | HTTP client |

## Usage

To use this extension:

1. Deploy the extension using CDK: `pnpm run app:dev`
2. Retrieve the extension ARN from SSM Parameter Store: `/telemetry/kinesis/extension/arn`
3. Retrieve the managed policy ARN from SSM Parameter Store: `/telemetry/kinesis/runtime/policy/arn`
4. Add the extension as a layer to your Lambda function
5. Attach the managed policy to your Lambda function's execution role

## Development

### Building the Extension

```bash
# Clean up previous builds
pnpm run prebuild

# Build the extension
pnpm run build

# Deploy the extension
pnpm run app:dev
```

### Testing

The extension includes a test Lambda function that demonstrates its usage. The function is deployed as part of the CDK stack.