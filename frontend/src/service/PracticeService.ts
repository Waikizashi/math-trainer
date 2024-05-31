import axios from 'axios';
import { API_URL } from './service.config';

export interface PracticeContent {
    contentType: string;
    title: string;
    data: string;
    mediaLink: string;
    possibleVertices: number[];
    possibleEdges: number[];
    graphProperties: string[];
}

export interface Practice {
    title: string;
    practiceContents: PracticeContent[];
}

const practice_service_URL = API_URL + '/practices';

class PracticeService {
    async createPractice(practice: Practice) {
        try {
            console.log(practice)
            const response = await axios.post(practice_service_URL, practice);
            return response.data;
        } catch (error) {
            console.error('Error creating practice', error);
            throw error;
        }
    };
    async getAllPractices() {
        try {
            const response = await axios.get(practice_service_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching practice', error);
            throw error;
        }
    };
}

export default new PracticeService();
