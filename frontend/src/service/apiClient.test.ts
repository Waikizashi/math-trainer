import { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { createApiClient, subscribeToSessionExpiry } from './apiClient';

function response(config: InternalAxiosRequestConfig, data: unknown, status = 200): AxiosResponse {
    return { config, data, status, statusText: String(status), headers: new AxiosHeaders() };
}
function reject(config: InternalAxiosRequestConfig, status: number, error: string): never {
    throw new AxiosError(error, undefined, config, undefined, response(config, { error }, status));
}
const token = (value: string) => ({ headerName: 'X-CSRF-TOKEN', token: value });

test('reads need no token; concurrent mutations share acquisition and reuse the token', async () => {
    const client = createApiClient();
    const adapter = jest.fn(async (config: InternalAxiosRequestConfig) =>
        response(config, config.url === '/api/csrf' ? token('first') : {}));
    client.defaults.adapter = adapter;
    await client.get('/api/theories');
    expect(adapter).toHaveBeenCalledTimes(1);
    await Promise.all([client.post('/api/register', {}), client.put('/api/users/1', {})]);
    await client.delete('/api/theories/1');
    expect(adapter.mock.calls.filter(([c]) => c.url === '/api/csrf')).toHaveLength(1);
    adapter.mock.calls.filter(([c]) => c.method !== 'get').forEach(([c]) => {
        expect(c.headers.get('X-CSRF-TOKEN')).toBe('first');
        expect(c.withCredentials).toBe(true);
    });
});

test('login and logout clear the token so later writes acquire the new session token', async () => {
    const client = createApiClient();
    let acquisitions = 0;
    const adapter = jest.fn(async (config: InternalAxiosRequestConfig) => response(config,
        config.url === '/api/csrf' ? token(String(++acquisitions)) : {}));
    client.defaults.adapter = adapter;
    await client.post('/api/login', {});
    await client.put('/api/user-profile/theory-completions', {});
    await client.post('/api/logout');
    await client.post('/api/login', {});
    expect(acquisitions).toBe(3);
    const writes = adapter.mock.calls.filter(([c]) => c.method === 'post' || c.method === 'put');
    expect(writes.map(([c]) => c.headers.get('X-CSRF-TOKEN'))).toEqual(['1', '2', '2', '3']);
});

test('an explicit CSRF filter rejection refreshes and retries the mutation once', async () => {
    const client = createApiClient();
    let acquisitions = 0;
    let attempts = 0;
    client.defaults.adapter = async config => {
        if (config.url === '/api/csrf') return response(config, token(String(++acquisitions)));
        if (++attempts === 1) reject(config, 403, 'csrf_invalid');
        expect(config.headers.get('X-CSRF-TOKEN')).toBe('2');
        return response(config, {});
    };
    await client.post('/api/user-profile/theory-completions', { theoryId: 1 });
    expect(acquisitions).toBe(2);
    expect(attempts).toBe(2);
});

test('repeated CSRF rejection stops after one retry', async () => {
    const client = createApiClient();
    let attempts = 0;
    client.defaults.adapter = async config => {
        if (config.url === '/api/csrf') return response(config, token('token'));
        attempts += 1;
        return reject(config, 403, 'csrf_invalid');
    };
    await expect(client.post('/api/register', {})).rejects.toBeInstanceOf(AxiosError);
    expect(attempts).toBe(2);
});

test.each([403, 401, 500])('HTTP %s without csrf_invalid never replays a mutation', async status => {
    const client = createApiClient();
    let attempts = 0;
    client.defaults.adapter = async config => {
        if (config.url === '/api/csrf') return response(config, token('token'));
        attempts += 1;
        return reject(config, status, 'access_denied');
    };
    await expect(client.put('/api/users/1', {})).rejects.toBeInstanceOf(AxiosError);
    expect(attempts).toBe(1);
});

test('session expiry clears authentication observers, while bad login does not', async () => {
    const client = createApiClient();
    const expired = jest.fn();
    const unsubscribe = subscribeToSessionExpiry(expired);
    client.defaults.adapter = async config => {
        if (config.url === '/api/csrf') return response(config, token('token'));
        return reject(config, 401, 'authentication_required');
    };
    try {
        await expect(client.post('/api/login', {})).rejects.toBeInstanceOf(AxiosError);
        expect(expired).not.toHaveBeenCalled();
        await expect(client.get('/api/theories')).rejects.toBeInstanceOf(AxiosError);
        expect(expired).toHaveBeenCalledTimes(1);
    } finally { unsubscribe(); }
});

test('malformed token responses fail before sending credentials', async () => {
    const client = createApiClient();
    const adapter = jest.fn(async (config: InternalAxiosRequestConfig) => response(config, { token: 'untrusted' }));
    client.defaults.adapter = adapter;
    await expect(client.post('/api/login', { password: 'secret' })).rejects.toThrow('Invalid CSRF response');
    expect(adapter).toHaveBeenCalledTimes(1);
    expect(adapter.mock.calls[0][0].url).toBe('/api/csrf');
});

test('tokens and credentials are never sent to an external or unexpected path', async () => {
    const client = createApiClient();
    const adapter = jest.fn();
    client.defaults.adapter = adapter;
    await expect(client.post('https://untrusted.example/api/login', {})).rejects.toThrow('same-origin');
    await expect(client.get('/other')).rejects.toThrow('same-origin');
    expect(adapter).not.toHaveBeenCalled();
});

test('network failures are not retried', async () => {
    const client = createApiClient();
    let attempts = 0;
    client.defaults.adapter = async config => {
        if (config.url === '/api/csrf') return response(config, token('token'));
        attempts += 1;
        throw new AxiosError('offline', undefined, config);
    };
    await expect(client.post('/api/register', {})).rejects.toThrow('offline');
    expect(attempts).toBe(1);
});
