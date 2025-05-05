import { basename } from 'path';

const RUNTIME_EXTENSION_URL = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-01-01/extension`;

const register = async (): Promise<string> => {
    const res = await fetch(`${RUNTIME_EXTENSION_URL}/register`, {
        method: 'post',
        body: JSON.stringify({
            'events': [
                'INVOKE',
                'SHUTDOWN'
            ],
        }),
        headers: {
            'Content-Type': 'application/json',
            'Lambda-Extension-Name': basename(__dirname),
        }
    });

    if (!res.ok) {
        console.error('[extensions-api:register] Registration failed:', await res.text());
    } else {
        return res.headers.get('lambda-extension-identifier') ?? '';
    }
    
    return '';
}

const next = async (extensionId: string): Promise<Record<string, any>> => {

    const res = await fetch(`${RUNTIME_EXTENSION_URL}/event/next`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Lambda-Extension-Identifier': extensionId,
        },
        keepalive: true,
    });

    if (!res.ok) {
        console.error('[extensions-api:next] Failed receiving next event', await res.text());
        return {};
    } else {
        return await res.json() as Record<string, any>;
    }
}

export default { register, next };