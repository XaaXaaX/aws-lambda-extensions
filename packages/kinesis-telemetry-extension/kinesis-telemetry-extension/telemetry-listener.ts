import { createServer } from 'http';
import { telemetryLogModel } from './types';

const LISTENER_HOST = 'sandbox';
const LISTENER_PORT = 4243;
const eventsQueue: Record<string, any>[] = [];

const onLogReceived = (logs: telemetryLogModel[]) => { 
    logs.forEach((element: telemetryLogModel) => {
        const message: Record<string, any> = element.record.message;
        eventsQueue.push(message ?? {});
    });
};

const start = (): string => {
    const server = createServer((request, response) => {
        if (request.method == "POST") {
            let body = '';
            request.on("data", (data) => { 
                body += data;
            });
            request.on("end", () => {
                try { onLogReceived(JSON.parse(body)); } 
                catch (e) { }

                response.writeHead(200, {});
                response.end("OK");
            });
        } else {
            console.error("unexpected request", request.method, request.url);
            response.writeHead(404, {});
            response.end();
        }
    });
      
    server.listen(LISTENER_PORT, LISTENER_HOST);
    return `http://${LISTENER_HOST}:${LISTENER_PORT}`;
}

export default { start, eventsQueue };

