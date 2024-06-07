import axios from 'axios';
import { GraphDataProps } from '../components/canvas/GraphCanvas';
import { API_URL } from './service.config';

const theory_service_URL = API_URL + '/theories'
export interface GraphNode {
    nodeId: string;
    group?: string;
}

export interface GraphLink {
    source: string;
    target: string;
    linkId?: string;
    weight?: string;
}

export interface GraphData {
    title: string;
    oriented: boolean,
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
    id: number,
    title: string;
    theoryContents: TheoryContent[];
}


class TheoryService {

    async createTheory(theory: Theory) {
        try {
            const response = await axios.post(theory_service_URL, theory);
            return response.data;
        } catch (error) {
            console.error('Error creating theory', error);
            throw error;
        }
    };

    async getAllTheories(): Promise<Theory[]> {
        const response = await axios.get<Theory[]>(theory_service_URL);
        return response.data;
    }

    async getTheoryById(id: number): Promise<Theory | null> {
        try {
            const response = await axios.get<Theory>(`${theory_service_URL}/${id}`);
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
            const response = await axios.put<Theory>(`${theory_service_URL}/${id}`, theory);
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
            await axios.delete(`${theory_service_URL}/${id}`);
            return true;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return false;
            }
            throw error;
        }
    }
    async fetchCompletion(): Promise<any> {
        try {
            const theoryCompletionsResponse = await axios.get('http://localhost:8080/api/user-profile/theory-completions');
            const theoryCompletions = theoryCompletionsResponse.data;

            const theorysResponse = await axios.get('http://localhost:8080/api/theories');
            const theories = theorysResponse.data;

            const segmentsData = theories.map((theory: Theory) => {
                const completedTheories = theoryCompletions.filter((completion: any) =>
                    completion.theoryId === theory.id && completion.theoryStatus === 'COMPLETED'
                );
                const totalTheories = theories.length;
                const completionRate = (completedTheories.length / totalTheories) * 100;
                return {
                    id: theory.id,
                    value: completionRate,
                    label: theory.title,
                    className: 'progress-bar bg-success'
                };
            });
            return segmentsData;
        } catch (error) {
            return ('Failed to fetch data' + error);
        }
    };
}

export default new TheoryService();
