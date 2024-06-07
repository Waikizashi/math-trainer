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
    id: number
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
    async getAllPractices(): Promise<Practice[]> {
        try {
            const response = await axios.get(practice_service_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching practice', error);
            throw error;
        }
    };
    async fetchCompletion(): Promise<any> {
        try {
            const practiceCompletionsResponse = await axios.get('http://localhost:8080/api/user-profile/practice-completions');
            const practiceCompletions = practiceCompletionsResponse.data;

            const practicesResponse = await axios.get('http://localhost:8080/api/practices');
            const practices = practicesResponse.data;

            const segmentsData = practices.map((practice: Practice) => {
                const completedPractices = practiceCompletions.filter((completion: any) =>
                    completion.practiceId === practice.id && completion.practiceStatus === 'COMPLETED'
                );
                const totalPractices = practices.length;
                const completionRate = (completedPractices.length / totalPractices) * 100;
                return {
                    id: practice.id,
                    value: completionRate,
                    label: practice.title,
                    className: 'progress-bar bg-info'
                };
            });

            return segmentsData;
        } catch (error) {
            return ('Failed to fetch data' + error);
        }
    };
}

export default new PracticeService();
