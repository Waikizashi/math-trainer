import axios from 'axios';

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

const API_URL = '/api/practices';

export const createPractice = async (practice: Practice) => {
    try {
        const response = await axios.post(API_URL, practice);
        return response.data;
    } catch (error) {
        console.error('Error creating practice', error);
        throw error;
    }
};
