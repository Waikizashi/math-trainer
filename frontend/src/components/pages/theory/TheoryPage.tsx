import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import GraphCanvas, { GraphDataProps } from '../../canvas/GraphCanvas';
import { mainContainer, subContainer, section } from '../../../utils/styles/global-styles';
import theoryService, { Theory } from '../../../service/TheoryService';
import TheoryComponent from './TheoryComponent';
import { mapGraphData } from '../../../utils/mappers';
import styles from './theoryPage.module.css';
import AuthContext from '../../../context/AuthContext';
import ProgressContainer from '../../progress/ProgressContainer';

const TheoryPage: React.FC = () => {
    const { tid } = useParams<{ tid: string }>();
    const { user } = useContext(AuthContext) || {};

    const [theories, setTheories] = useState<Theory[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [graphData, setGraphData] = useState<GraphDataProps | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [contentFocus, setContentFocus] = useState(0);
    const [graphFocus, setGraphFocus] = useState(0);

    // Загрузка списка тем и установка текущего индекса по tid
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const all = await theoryService.getAllTheories();
                setTheories(all);
                if (tid) {
                    const idNum = parseInt(tid, 10);
                    const idx = all.findIndex(t => t.id === idNum);
                    setCurrentIndex(idx >= 0 ? idx : 0);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка загрузки тем');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [tid]);

    // Обновление graphData при смене темы или фокуса
    useEffect(() => {
        if (!theories.length) return;
        const theory = theories[currentIndex];
        const content = theory.theoryContents[contentFocus];
        const graphItem = content?.graphData[graphFocus];
        setGraphData(graphItem ? mapGraphData(graphItem) : undefined);
    }, [theories, currentIndex, contentFocus, graphFocus]);

    // Обработчики фокуса
    const handleContentFocus = (idx: number) => {
        setContentFocus(idx);
        setGraphFocus(0);
    };
    const handleGraphFocus = (idx: number, graphIdx: number) => {
        setGraphFocus(graphIdx);
        setContentFocus(idx);
    };

    // Пагинация тем
    const changeVisualization = (delta: number) => {
        setCurrentIndex(prev => {
            const next = prev + delta;
            return next < 0 || next >= theories.length ? 0 : next;
        });
        setContentFocus(0);
        setGraphFocus(0);
    };

    const getCurrentTheory = () => theories[currentIndex];

    return (
        <div className={mainContainer}>
            <div className={subContainer}>
                <div className={section}>
                    <div className="card-header bg-success bg-opacity-25 fw-bold text-secondary-emphasis">
                        {getCurrentTheory()?.title.toUpperCase()}
                    </div>
                    <div className="card-body bg-success bg-opacity-10">
                        {loading ? <div>Loading...</div> : error ? <div>{error}</div> : (
                            <TheoryComponent
                                theory={getCurrentTheory()}
                                user={user}
                                onContentClick={handleContentFocus}
                                onGraphClick={handleGraphFocus}
                            />
                        )}
                    </div>
                    <div className="card-footer bg-success bg-opacity-25">
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
                    {loading ? <div>Loading...</div> : error ? null : (
                        graphData ? (
                            <GraphCanvas graphData={graphData} canvasPreferencies={{ scale: 1.5 }} />
                        ) : (
                            <div>Select a graph to visualize</div>
                        )
                    )}
                </div>
            </div>
            <ProgressContainer type="theory" actualize={currentIndex}/>
        </div>
    );
};

export default TheoryPage;
