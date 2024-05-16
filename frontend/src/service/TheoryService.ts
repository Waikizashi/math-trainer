import axios from 'axios';
import { GraphDataProps } from '../components/graphs/GraphCanvas';

const API_URL = 'http://localhost:8080/api/theories'

export interface TheoryDTO {
    id: number;
    title: string;
    content: ContentDTO[];
}

export interface ContentDTO {
    id: number;
    contentType: string;
    title: string;
    data: string;
    imgLink: string;
    graphData: GraphDataProps[];
    theoryId: number;
}


class TheoryService {
    async getAllTheories(): Promise<TheoryDTO[]> {
        const response = await axios.get<TheoryDTO[]>(API_URL);
        return response.data;
    }

    async getTheoryById(id: number): Promise<TheoryDTO | null> {
        try {
            const response = await axios.get<TheoryDTO>(`${API_URL}/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async createTheory(theoryDTO: TheoryDTO): Promise<TheoryDTO> {
        const response = await axios.post<TheoryDTO>(API_URL, theoryDTO);
        return response.data;
    }

    async updateTheory(id: number, theoryDTO: TheoryDTO): Promise<TheoryDTO | null> {
        try {
            const response = await axios.put<TheoryDTO>(`${API_URL}/${id}`, theoryDTO);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async deleteTheory(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return false;
            }
            throw error;
        }
    }
}

export default new TheoryService();
