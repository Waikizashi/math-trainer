import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import MainMenu from '../../navigation/Menu';
import GraphCanvas, { GraphDataProps } from '../../graphs/GraphCanvas';
import { mainContainer, section, subContainer } from '../../../utils/styles/global-styles';
import PracticeComponent from './PracticeComponent';
import practiceService, { Practice } from '../../../service/PracticeService';

const PracticePage = () => {
    const [currentTopic, setCurrentTopic] = useState(0);
    const [graphData, setGraphData] = useState<GraphDataProps | undefined>(undefined);

    const [practices, setPractices] = useState<Practice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPractices = async () => {
            try {
                const data = await practiceService.getAllPractices();
                console.log("DATA:", data);
                setPractices(data);
            } catch (error) {
                setError('ERROR:' + error);
            } finally {
                setLoading(false);
            }
        };

        fetchPractices();
    }, []);

    const changeGraphData = (currentGraphData: GraphDataProps) => {
        setGraphData(currentGraphData);
    };

    const changeVisualization = (prevNext: number) => {
        setCurrentTopic(prevTopic => {
            const currentTopic: number = prevTopic + prevNext;
            return (currentTopic >= practices.length || currentTopic < 0) ? 0 : currentTopic;
        });
    };

    const segments = [
        { id: 1, value: 20, label: 'Segment one', className: 'progress-bar bg-info' },
        { id: 2, value: 20, label: 'Segment two', className: 'progress-bar bg-info' },
        { id: 3, value: 20, label: 'Segment three', className: 'progress-bar bg-info' },
    ];

    return (
        <div className={mainContainer}>
            {/* <MainMenu /> */}
            <div className={subContainer}>
                <div className={section}>
                    <div className="card-header">
                        Task
                    </div>
                    <div className="card-body bg-info-subtle">
                        <PracticeComponent practice={practices[currentTopic]} graphData={graphData} />
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
                    <GraphCanvas canvasPreferencies={{ getCurrentGraphData: changeGraphData }} />
                </div>
            </div>
            <div className="progress-stacked w-75 p-0 my-2">
                {segments.map(segment => (
                    <div
                        key={segment.id}
                        className="progress"
                        role="progressbar"
                        aria-label={segment.label}
                        aria-valuenow={segment.value} // Убедитесь, что здесь число
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

export default PracticePage;
