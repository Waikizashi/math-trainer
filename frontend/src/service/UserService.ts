import axios from 'axios';
import { API_URL } from './service.config';

const user_service_URL = API_URL + '/users'

export interface UserResponse {
    id?: number;
    username: string;
    email: string;
    role: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface UserUpdateRequest {
    username: string;
    email: string;
}

class UserService {

    async getAllUsers(): Promise<UserResponse[]> {
        const response = await axios.get<UserResponse[]>(user_service_URL);
        return response.data;
    }

    async getUserById(id: number): Promise<UserResponse | null> {
        try {
            const response = await axios.get<UserResponse>(`${user_service_URL}/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async updateUser(id: number, user: UserUpdateRequest): Promise<UserResponse | null> {
        try {
            const response = await axios.put<UserResponse>(`${user_service_URL}/${id}`, user);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            await axios.delete(`${user_service_URL}/${id}`);
            return true;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return false;
            }
            throw error;
        }
    }
}

export default new UserService();
