const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2022-07-01/telemetry`;
const BUFFER_TIMEOUT_MS = 100; 
const LOGS_BUFFER_MAX_BYTES = 256 * 1024;
const MAX_BUFFER_ITEMS_COUNT = 1000; // Maximum number of events that are buffered in memory.

async function subscribe(extensionId: string, listenerUri: string) {

    if(!extensionId || !listenerUri) {
        console.error('[Extension] Failed to subscribe the extension, the extensionId or Listener url not valid');
        return;
    }

    const subscriptionBody = {
        schemaVersion: "2022-12-13",
        destination: {
            protocol: "HTTP",
            URI: listenerUri,
        },
        types: ['function'],
        buffering: {
            timeoutMs: BUFFER_TIMEOUT_MS,
            maxBytes: LOGS_BUFFER_MAX_BYTES,
            maxItems: MAX_BUFFER_ITEMS_COUNT
        }
    };

    const res = await fetch(baseUrl, {
        keepalive: true,
        method: 'put',
        body: JSON.stringify(subscriptionBody),
        headers: {
            'Content-Type': 'application/json',
            'Lambda-Extension-Identifier': extensionId,
        }
    });

    switch (res.status) {
        case 200:
            break;
        case 202:
            console.warn('[Extension] Telemetry API not supported. Are you running the extension locally?');
            break;
        default:
            console.error('[Extension] Subscription failure:', await res.text());
            break;
    }
}

export default { subscribe };