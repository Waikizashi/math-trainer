import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import theoryService from '../../service/TheoryService';
import practiceService from '../../service/PracticeService';

const ProgressContainer = ({ type }) => {
    const [segments, setSegments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {

            switch (type) {
                case 'theory':
                    await theoryService.fetchCompletion()
                        .then((segments) => {
                            setSegments(segments)
                        })
                        .catch((error) => {
                            setError(error)
                        })
                        .finally((loading) => {
                            setLoading(loading)
                        })
                    break;
                case 'practice':
                    await practiceService.fetchCompletion()
                        .then((segments) => {
                            setSegments(segments)
                        })
                        .catch((error) => {
                            setError(error)
                        })
                        .finally((loading) => {
                            setLoading(loading)
                        })
                    break;
                default:
                    break;
            }
        }
        fetchData()
    }, [type]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (segments ? <ProgressBar type={type} segments={segments} /> : <></>);
};

export default ProgressContainer;
