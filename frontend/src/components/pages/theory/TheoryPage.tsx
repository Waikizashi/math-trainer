import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import GraphCanvas, { GraphDataProps } from '../../graphs/GraphCanvas';
import MainMenu from '../../navigation/Menu';
import { mainContainer, subContainer, section, visualArea } from '../../../utils/styles/global-styles';
import theoryService, { GraphData, Theory } from '../../../service/TheoryService';
import TheoryComponent from './TheoryComponent';
import { mapGraphData } from '../../../utils/mappers';
import styles from './theoryPage.module.css'; // Убедитесь, что путь к файлу верный

const TheoryPage: React.FC<any> = () => {
    const [currentTopic, setCurrentTopic] = useState(0);
    const [currentContentFocus, setCurrentContentFocus] = useState(0);
    const [currentContentGraphFocus, setCurrentContentGraphFocus] = useState(0);

    const [theories, setTheories] = useState<Theory[]>([]);
    const [graphData, setGraphData] = useState<GraphDataProps | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTheories = async () => {
            try {
                const data = await theoryService.getAllTheories();
                console.log("DATA:", data);
                setTheories(data);
            } catch (error) {
                setError('ERROR:' + error);
            } finally {
                setLoading(false);
            }
        };

        fetchTheories();
    }, []);

    useEffect(() => {
        const content = theories[currentTopic]?.theoryContents[currentContentFocus];
        const graph = content?.graphData[currentContentGraphFocus];
        if (graph) {
            setGraphData(mapGraphData(graph));
        } else {
            setGraphData(undefined);
        }
    }, [currentContentGraphFocus, currentContentFocus, currentTopic, theories]);

    const changeVisualization = (prevNext: number) => {
        setCurrentTopic(prevTopic => {
            const currentTopic: number = prevTopic + prevNext;
            return (currentTopic >= theories.length || currentTopic < 0) ? 0 : currentTopic;
        });
    };

    const handleContentClick = (contentIndex: number) => {
        setCurrentContentFocus(contentIndex);
        setCurrentContentGraphFocus(0); // Reset graph focus when content changes
    };

    const handleGraphClick = (contentIndex: number, graphIndex: number) => {
        setCurrentContentFocus(contentIndex);
        setCurrentContentGraphFocus(graphIndex);
    };

    const segments = [
        { id: 1, value: 20, label: 'Segment one', className: 'progress-bar bg-success' },
        { id: 2, value: 20, label: 'Segment two', className: 'progress-bar bg-success' },
        { id: 3, value: 20, label: 'Segment three', className: 'progress-bar bg-success' },
    ];

    return (
        <div className={mainContainer}>
            {/* <MainMenu /> */}
            <div className={subContainer}>
                <div className={section}>
                    <div className="card-header">
                        Theory
                    </div>
                    <div className="card-body bg-success-subtle">
                        {loading ? <div>Loading...</div> : error ? <div>{error}</div> :
                            <TheoryComponent
                                theory={theories[0] ? theories[0] : null}
                                onContentClick={handleContentClick}
                                onGraphClick={handleGraphClick}
                                currentContentFocus={currentContentFocus}
                                currentContentGraphFocus={currentContentGraphFocus}
                            />}
                    </div>
                    <div className="card-footer text-body-secondary">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination m-0 d-flex justify-content-center">
                                <li className="page-item">
                                    <a className="page-link" onClick={() => changeVisualization(-1)} href="#" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item" onClick={() => changeVisualization(1)}>
                                    <a className="page-link" href="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className={section}>
                    <div className="card-header">
                        Visualization
                    </div>
                    {loading ? <div>Loading...</div> : error ? null : (
                        graphData ? (
                            <GraphCanvas graphData={graphData} canvasPreferencies={{ scale: 1.5 }} />
                        ) : (
                            <div>Select a graph to visualize</div>
                        )
                    )}
                </div>
            </div>
            <div className="progress-stacked w-75 p-0 my-2">
                {segments.map(segment => (
                    <div
                        key={segment.id}
                        className="progress"
                        role="progressbar"
                        aria-label={segment.label}
                        aria-valuenow={segment.value}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        style={{ width: `${segment.value}%` }}
                    >
                        <div className={segment.className}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TheoryPage;
