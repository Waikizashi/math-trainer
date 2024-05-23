import axios from 'axios';
import { GraphDataProps } from '../components/graphs/GraphCanvas';

const API_URL = 'http://localhost:8080/api/theories'
export interface GraphNode {
    nodeId: string;
    group?: string;
}

export interface GraphLink {
    source: string;
    target: string;
}

export interface GraphData {
    title: string;
    nodes: GraphNode[];
    links: GraphLink[];
}

export interface TheoryContent {
    contentType: string;
    title?: string;
    data: string;
    mediaLink?: string;
    graphData: GraphData[];
}

export interface Theory {
    title: string;
    theoryContent: TheoryContent[];
}


class TheoryService {

    async createTheory(theory: Theory) {
        try {
            const response = await axios.post(API_URL, theory);
            return response.data;
        } catch (error) {
            console.error('Error creating theory', error);
            throw error;
        }
    };

    async getAllTheories(): Promise<Theory[]> {
        const response = await axios.get<Theory[]>(API_URL);
        return response.data;
    }

    async getTheoryById(id: number): Promise<Theory | null> {
        try {
            const response = await axios.get<Theory>(`${API_URL}/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async updateTheory(id: number, theory: Theory): Promise<Theory | null> {
        try {
            const response = await axios.put<Theory>(`${API_URL}/${id}`, theory);
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
