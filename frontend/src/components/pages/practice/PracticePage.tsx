import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import cn from 'classnames';
import MainMenu from '../../navigation/Menu';
import GraphCanvas, { GraphDataProps } from '../../canvas/GraphCanvas';
import { mainContainer, section, subContainer } from '../../../utils/styles/global-styles';
import PracticeComponent from './PracticeComponent';
import practiceService, { Practice } from '../../../service/PracticeService';
import AuthContext from '../../../context/AuthContext';
import ProgressBar from '../../progress/ProgressBar';
import ProgressContainer from '../../progress/ProgressContainer';

const PracticePage = () => {
    const [currentTopic, setCurrentTopic] = useState(0);
    const [currentTopicByEid, setCurrentTopicByEid] = useState(0);
    const [graphData, setGraphData] = useState<GraphDataProps | undefined>(undefined);
    const { eid } = useParams();
    const [loadedByEid, setLoadedByPathEid] = useState(true)
    const user = useContext(AuthContext)?.user;

    const [practices, setPractices] = useState<Practice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPractices = async () => {
            try {
                const tmpPractices = await practiceService.getAllPractices();
                setPractices(tmpPractices);

                if (eid && loadedByEid) {
                    const curPractice = tmpPractices.find(practice => practice.id === parseInt(eid))?.id;
                    setCurrentTopicByEid(curPractice ? curPractice : 0);
                } else {
                    setCurrentTopic(0);
                }
            } catch (error) {
                setError('ERROR: ' + error);
            } finally {
                setLoading(false);
            }
        };

        fetchPractices();
    }, [eid]);

    const getCurrentPractice = (): Practice | undefined => {
        if (loadedByEid) {
            setLoadedByPathEid(false)
            return practices.find(practice => practice.id === currentTopicByEid)
        } else {
            return practices[currentTopic];
        }
    }

    const changeGraphData = (currentGraphData: GraphDataProps) => {
        setGraphData(currentGraphData);
    };

    const changeVisualization = (prevNext: number) => {
        setCurrentTopic(prevTopic => {
            const currentTopic: number = prevTopic + prevNext;
            return (currentTopic >= practices.length || currentTopic < 0) ? 0 : currentTopic;
        });
    };

    return (
        <div className={mainContainer}>
            <div className={subContainer}>
                <div className={section}>
                    <div className="card-header bg-info bg-opacity-25 fw-bold text-secondary-emphasis">
                        {getCurrentPractice()?.title.toUpperCase()}
                    </div>
                    <div className="card-body bg-info bg-opacity-10">
                        <PracticeComponent practice={getCurrentPractice()} graphData={graphData} user={user} />
                    </div>
                    <div className="card-footer bg-info bg-opacity-25">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination m-0 d-flex justify-content-center">
                                <li className="page-item">
                                    <a className="page-link" onClick={() => changeVisualization(-1)} href="#" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                {/* <li className="page-item"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li> */}
                                <li className="page-item" onClick={() => changeVisualization(1)}>
                                    <a className="page-link" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className={section}>
                    <GraphCanvas canvasPreferencies={{ getCurrentGraphData: changeGraphData }} />
                </div>
            </div>
            <ProgressContainer type={'practice'} />
        </div>
    );
};

export default PracticePage;
