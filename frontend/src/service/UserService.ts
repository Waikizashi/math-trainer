import axios from 'axios';
import { API_URL } from './service.config';

const user_service_URL = API_URL + '/user'

export interface UserDTO {
    id?: number;
    username: string;
    password: string;
    email: string;
    role: string;
    saves?: string;
}

class UserService {

    async getAllUsers(): Promise<UserDTO[]> {
        const response = await axios.get<UserDTO[]>(user_service_URL);
        return response.data;
    }

    async getUserById(id: number): Promise<UserDTO | null> {
        try {
            const response = await axios.get<UserDTO>(`${user_service_URL}/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async updateUser(id: number, user: UserDTO): Promise<UserDTO | null> {
        try {
            const response = await axios.put<UserDTO>(`${user_service_URL}/${id}`, user);
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
