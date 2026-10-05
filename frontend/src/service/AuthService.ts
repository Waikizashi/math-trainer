import api from './apiClient';
import { API_URL } from './service.config';
import { RegisterRequest, UserResponse } from './UserService';

class AuthService {
    // Purge the legacy response cache, which could contain password hashes.
    private clearLegacyCache() {
        localStorage.removeItem('user');
    }

    async register(user: RegisterRequest): Promise<UserResponse> {
        this.clearLegacyCache();
        const response = await api.post<UserResponse>(`${API_URL}/register`, user);
        return response.data;
    }

    async login(username: string, password: string): Promise<UserResponse> {
        this.clearLegacyCache();
        const response = await api.post<UserResponse>(`${API_URL}/login`, { username, password });
        return response.data;
    }

    async logout(): Promise<void> {
        this.clearLegacyCache();
        await api.post(`${API_URL}/logout`);
    }

    async getCurrentUser(): Promise<UserResponse | null> {
        this.clearLegacyCache();
        try {
            const response = await api.get<UserResponse>(`${API_URL}/current/user`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) return null;
            // A network/server failure must not be presented as a successful guest session.
            throw error;
        }
    }
}

export default new AuthService();
