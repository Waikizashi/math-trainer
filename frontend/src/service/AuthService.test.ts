import client from './apiClient';
import AuthService from './AuthService';
import { API_URL } from './service.config';

jest.mock('./apiClient', () => ({ __esModule: true, default: { get: jest.fn(), post: jest.fn() } }));
const api = client as jest.Mocked<typeof client>;
const user = { id: 1, username: 'alice', email: 'alice@example.com', role: 'USER' };

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
});

test('current user comes from the server and purges the old credential cache', async () => {
    localStorage.setItem('user', JSON.stringify({ ...user, role: 'ADMIN', password: 'old-hash' }));
    api.get.mockResolvedValue({ data: user });
    expect(await AuthService.getCurrentUser()).toEqual(user);
    expect(localStorage.getItem('user')).toBeNull();
});

test('login keeps account details out of persistent browser storage', async () => {
    api.post.mockResolvedValue({ data: user });
    expect(await AuthService.login('alice', 'valid-password')).toEqual(user);
    expect(localStorage.getItem('user')).toBeNull();
});

test('registration sends only identity and credentials', async () => {
    api.post.mockResolvedValue({ data: user });
    const request = { username: 'alice', email: 'alice@example.com', password: 'valid-password' };
    await AuthService.register(request);
    expect(api.post).toHaveBeenCalledWith(`${API_URL}/register`, request);
});

test('expired session resolves to guest', async () => {
    api.get.mockRejectedValue({ response: { status: 401 } });
    expect(await AuthService.getCurrentUser()).toBeNull();
});

test('network failures are propagated', async () => {
    const error = new Error('offline');
    api.get.mockRejectedValue(error);
    await expect(AuthService.getCurrentUser()).rejects.toBe(error);
});

test('logout clears the old cache and calls the session endpoint', async () => {
    localStorage.setItem('user', 'legacy');
    api.post.mockResolvedValue({ data: {} });
    await AuthService.logout();
    expect(localStorage.getItem('user')).toBeNull();
    expect(api.post).toHaveBeenCalledWith(`${API_URL}/logout`);
});
