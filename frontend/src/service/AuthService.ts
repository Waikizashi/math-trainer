import axios from 'axios';
import { API_URL } from './service.config';
import { UserDTO } from './UserService';



class AuthService {
    async register(user: UserDTO) {
        try {
            const response = await axios.post(`${API_URL}/register`, user);
            return response.data;
        } catch (error) {
            console.error('Error registering user', error);
            throw error;
        }
    }

    async login(username: string, password: string) {
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('Error logging in', error);
            throw error;
        }
    }

    async logout() {
        try {
            localStorage.removeItem('user');
            await axios.post(`${API_URL}/logout`);
        } catch (error) {
            console.error('Error logging out', error);
            throw error;
        }
    }
}

export default new AuthService();