import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GraphCanvas, { GraphDataProps } from '../../canvas/GraphCanvas';
import { mainContainer, subContainer, section } from '../../../utils/styles/global-styles';
import PracticeComponent from './PracticeComponent';
import practiceService, { Practice } from '../../../service/PracticeService';
import AuthContext from '../../../context/AuthContext';
import ProgressContainer from '../../progress/ProgressContainer';

const PracticePage: React.FC = () => {
    const { eid } = useParams<{ eid: string }>();
    const { user } = useContext(AuthContext) || {};

    const [practices, setPractices] = useState<Practice[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [graphData, setGraphData] = useState<GraphDataProps | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Загрузка списка практик и установка currentIndex по eid
    useEffect(() => {
        const fetchPractices = async () => {
            try {
                const all = await practiceService.getAllPractices();
                setPractices(all);
                if (eid) {
                    const idNum = parseInt(eid, 10);
                    const idx = all.findIndex(p => p.id === idNum);
                    setCurrentIndex(idx >= 0 ? idx : 0);
                } else {
                    setCurrentIndex(0);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка загрузки практик');
            } finally {
                setLoading(false);
            }
        };
        fetchPractices();
    }, [eid]);

    const getCurrentPractice = (): Practice | undefined => practices[currentIndex];

    // Пагинация тем практики
    const changeVisualization = (delta: number) => {
        setCurrentIndex(prev => {
            const next = prev + delta;
            return next < 0 || next >= practices.length ? 0 : next;
        });
    };

    // Обработчик для GraphCanvas
    const handleGraphData = (data: GraphDataProps) => {
        setGraphData(data);
    };

    return (
        <div className={mainContainer}>
            <div className={subContainer}>
                <div className={section}>
                    <div className="card-header bg-info bg-opacity-25 fw-bold text-secondary-emphasis">
                        {getCurrentPractice()?.title.toUpperCase()}
                    </div>
                    <div className="card-body bg-info bg-opacity-10">
                        {loading ? (
                            <div>Loading...</div>
                        ) : error ? (
                            <div>{error}</div>
                        ) : (
                            <PracticeComponent
                                practice={getCurrentPractice()}
                                graphData={graphData}
                                user={user}
                            />
                        )}
                    </div>
                    <div className="card-footer bg-info bg-opacity-25">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination m-0 d-flex justify-content-center">
                                <li className="page-item">
                                    <button
                                        className="page-link"
                                        onClick={() => changeVisualization(-1)}
                                        aria-label="Previous"
                                    >
                                        <span aria-hidden="true">&laquo;</span>
                                    </button>
                                </li>
                                <li className="page-item">
                                    <button
                                        className="page-link"
                                        onClick={() => changeVisualization(1)}
                                        aria-label="Next"
                                    >
                                        <span aria-hidden="true">&raquo;</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className={section}>
                    <GraphCanvas canvasPreferencies={{ getCurrentGraphData: handleGraphData }} />
                </div>
            </div>
            <ProgressContainer type="practice" actualize={currentIndex}/>
        </div>
    );
};

export default PracticePage;
