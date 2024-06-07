import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GraphCanvas, { GraphDataProps } from '../../canvas/GraphCanvas';
import { mainContainer, subContainer, section } from '../../../utils/styles/global-styles';
import theoryService, { Theory } from '../../../service/TheoryService';
import TheoryComponent from './TheoryComponent';
import { mapGraphData } from '../../../utils/mappers';
import styles from './theoryPage.module.css'; // Убедитесь, что путь к файлу верный
import AuthContext from '../../../context/AuthContext';
import ProgressContainer from '../../progress/ProgressContainer';

const TheoryPage: React.FC<any> = () => {
    const [currentTopic, setCurrentTopic] = useState(0);
    const [currentTopicByTid, setCurrentTopicByTid] = useState(0);
    const [graphData, setGraphData] = useState<GraphDataProps | undefined>(undefined);
    const { tid } = useParams();
    const { user } = useContext(AuthContext) || {};
    const [loadedByTid, setLoadedByPathEid] = useState(true)
    const [theories, setTheories] = useState<Theory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentContentFocus, setCurrentContentFocus] = useState(0);
    const [currentContentGraphFocus, setCurrentContentGraphFocus] = useState(0);

    useEffect(() => {
        const fetchTheories = async () => {
            try {
                const tmpTheories = await theoryService.getAllTheories();
                setTheories(tmpTheories);
                if (tid && loadedByTid) {
                    const curTheory = tmpTheories.find(theory => theory?.id === parseInt(tid))?.id;
                    setCurrentTopic(curTheory ? curTheory : 0);
                } else {
                    setCurrentTopic(0)
                }
            } catch (error) {
                setError('ERROR:' + error);
            } finally {
                setLoading(false);
            }
        };

        fetchTheories();
    }, [tid]);

    const getCurrentTheory = (): Theory | undefined => {
        if (loadedByTid) {
            setLoadedByPathEid(false)
            return theories.find(theory => theory.id === currentTopicByTid)
        } else {
            return theories[currentTopic];
        }
    }

    useEffect(() => {
        const content = getCurrentTheory()?.theoryContents[0];
        const graph = content?.graphData[0];
        if (graph) {
            setGraphData(mapGraphData(graph));
        } else {
            setGraphData(undefined);
        }
    }, [currentTopic, theories]);

    const changeVisualization = (prevNext: number) => {
        setCurrentTopic(prevTopic => {
            const nextTopic = prevTopic + prevNext;
            return nextTopic >= theories.length || nextTopic < 0 ? 0 : nextTopic;
        });
    };

    const handleCurrentContentFocus = (currentContentFocus: number) => {
        setCurrentContentFocus(currentContentFocus)
        setCurrentContentGraphFocus(0)
    }
    const handleCurrentContentGraphFocus = (currentContentFocus: number, currentContentGraphFocus: number) => {
        setCurrentContentFocus(currentContentFocus)
        setCurrentContentGraphFocus(currentContentGraphFocus)
    }

    useEffect(() => {
        const content = getCurrentTheory()?.theoryContents[currentContentFocus];
        const graph = content?.graphData[currentContentGraphFocus];
        if (graph) {
            setGraphData(mapGraphData(graph));
        } else {
            setGraphData(undefined);
        }
    }, [currentContentFocus, currentContentGraphFocus])

    const segments = [
        { id: 1, value: 20, label: 'Segment one', className: 'progress-bar bg-success' },
        { id: 2, value: 20, label: 'Segment two', className: 'progress-bar bg-success' },
        { id: 3, value: 20, label: 'Segment three', className: 'progress-bar bg-success' },
    ];

    return (
        <div className={mainContainer}>
            <div className={subContainer}>
                <div className={section}>
                    <div className="card-header bg-success bg-opacity-25 fw-bold text-secondary-emphasis">
                        {getCurrentTheory()?.title.toUpperCase()}
                    </div>
                    <div className="card-body bg-success bg-opacity-10">
                        {loading ? <div>Loading...</div> : error ? <div>{error}</div> :
                            <TheoryComponent
                                theory={getCurrentTheory()}
                                user={user}
                                onContentClick={handleCurrentContentFocus}
                                onGraphClick={handleCurrentContentGraphFocus}
                            />}
                    </div>
                    <div className="card-footer bg-success bg-opacity-25">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination m-0 d-flex justify-content-center">
                                <li className="page-item">
                                    <div className="page-link" onClick={() => changeVisualization(-1)} aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </div>
                                </li>
                                {/* <li className="page-item"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li> */}
                                <li className="page-item" onClick={() => changeVisualization(1)}>
                                    <div className="page-link" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className={section}>
                    {loading ? <div>Loading...</div> : error ? null : (
                        graphData ? (
                            <GraphCanvas graphData={graphData} canvasPreferencies={{ scale: 1.5 }} />
                        ) : (
                            <div>Select a graph to visualize</div>
                        )
                    )}
                </div>
            </div>
            <ProgressContainer type={'theory'} />
        </div>
    );
};

export default TheoryPage;
