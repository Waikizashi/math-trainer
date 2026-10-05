import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from './service.config';

interface CsrfToken { headerName: string; token: string }
type RetryConfig = InternalAxiosRequestConfig & { csrfRetried?: boolean };
const expiryListeners = new Set<() => void>();

export function subscribeToSessionExpiry(listener: () => void): () => void {
    expiryListeners.add(listener);
    return () => { expiryListeners.delete(listener); };
}

// Each client owns its token state. Nothing is saved to browser storage or a readable cookie.
export function createApiClient(): AxiosInstance {
    const client = axios.create({ withCredentials: true });
    let cached: CsrfToken | null = null;
    let pending: Promise<CsrfToken> | null = null;
    let generation = 0;

    const invalidate = () => { cached = null; pending = null; generation += 1; };
    const acquire = (): Promise<CsrfToken> => {
        if (cached) return Promise.resolve(cached);
        if (pending) return pending;
        const started = generation;
        const request: Promise<CsrfToken> = client.get<CsrfToken>(`${API_URL}/csrf`).then(response => {
            const token = response.data;
            if (token.headerName !== 'X-CSRF-TOKEN' || typeof token.token !== 'string' || !token.token) {
                throw new Error('Invalid CSRF response');
            }
            // A login/logout may finish while this request is in flight.
            if (started !== generation) return acquire();
            cached = token;
            return token;
        }).finally(() => { if (pending === request) pending = null; });
        pending = request;
        return request;
    };

    const unsafe = (config: InternalAxiosRequestConfig) =>
        !['get', 'head', 'options'].includes((config.method || 'get').toLowerCase());

    client.interceptors.request.use(async config => {
        if (!config.url?.startsWith(`${API_URL}/`) || config.baseURL) {
            throw new Error('API client requires a same-origin /api/ path');
        }
        if (unsafe(config)) {
            const token = await acquire();
            config.headers.set(token.headerName, token.token);
        }
        return config;
    });

    client.interceptors.response.use(response => {
        if (['/api/login', '/api/logout'].includes(response.config.url || '')) invalidate();
        return response;
    }, async (error: AxiosError<{ error?: string }>) => {
        const config = error.config as RetryConfig | undefined;
        if (config && unsafe(config) && !config.csrfRetried && error.response?.status === 403
                && error.response.data?.error === 'csrf_invalid') {
            // This specific filter rejection happens before application mutation. Retry once only.
            config.csrfRetried = true;
            if (cached?.token === config.headers.get('X-CSRF-TOKEN')) cached = null;
            await acquire();
            return client.request(config);
        }
        if (error.response?.status === 401 && !['/api/login', '/api/register', '/api/current/user']
                .includes(config?.url || '')) {
            invalidate();
            expiryListeners.forEach(listener => listener());
        }
        return Promise.reject(error);
    });
    return client;
}

export default createApiClient();
