#!/usr/bin/env node
import telemetryApi from './telemetry-api';
import extensionsApi from './extensions-api';
import telemetryListener from './telemetry-listener';
import telemetryDispatcher from './telemetry-dispatcher';
import { setGlobalDispatcher, Agent } from 'undici';

export const CONNECTION_TIMEOUT_MS = 60 * 60_000;
// Fetch is a global native api
// There is no possibility to configure the agent per request
// So we need to set the global agent configuration
// This is a workaround to globally set the agent configuration
setGlobalDispatcher(new Agent({
    connectTimeout: CONNECTION_TIMEOUT_MS,
    headersTimeout: CONNECTION_TIMEOUT_MS,
    bodyTimeout: CONNECTION_TIMEOUT_MS,
    keepAliveTimeout: CONNECTION_TIMEOUT_MS,
    keepAliveMaxTimeout: CONNECTION_TIMEOUT_MS
}));
const waitToRceiveAllRemainigFor = (ms: number) => { return new Promise(resolve => setTimeout(resolve, ms)); };
const handleShutdown = () => { process.exit(0); }

(async function main() {
    process.on('SIGINT', () => handleShutdown());
    process.on('SIGTERM', () => handleShutdown());

    const extensionId = await extensionsApi.register();
    const listenerUri = telemetryListener.start();

    await telemetryApi.subscribe(extensionId, listenerUri);

    while (true) {
        try {
            const event = await extensionsApi.next(extensionId);
            switch (event?.eventType) {
                case 'INVOKE':
                    await telemetryDispatcher.dispatch(telemetryListener.eventsQueue, false); 
                    break;
                case 'SHUTDOWN':
                    await ImmediateDispatchAndExit();
                    break;
                default:
                    throw new Error('[Extension] unknown event: ' + JSON.stringify(event));
            }
        }   catch (err) {
            console.error('[Extension] Error:', err);
            await ImmediateDispatchAndExit();
        }
    }

    async function ImmediateDispatchAndExit() {
        await waitToRceiveAllRemainigFor(300); 
        await telemetryDispatcher.dispatch(telemetryListener.eventsQueue, true);
        handleShutdown();
    }
})();