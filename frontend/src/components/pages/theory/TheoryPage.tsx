import React, { useEffect, useRef, useState } from 'react';
import s from './theoryPage.module.css';
import cn from 'classnames';
import Fab from '@mui/material/Fab';
import GraphCanvas, { GraphDataProps } from '../../graphs/GraphCanvas';
import MainMenu from '../../navigation/Menu';

import { mainContainer, subContainer, section, visualArea } from '../../../utils/styles/global-styles';

interface MyComponentProps {
    title: string;
    description?: string;
}

const graphs: GraphDataProps[] = [
    {
        nodes: [
            { id: "0", group: 1 },
            { id: "1", group: 1 },
            { id: "2", group: 1 },
            { id: "3", group: 1 },
            { id: "4", group: 1 }
        ],
        links: [
            { source: "0", target: "1", },
            { source: "1", target: "2", },
            { source: "2", target: "3", },
            { source: "3", target: "4", },
            { source: "4", target: "0", }
        ]
    },
    {
        nodes: [
            { id: "0", group: 1 },
            { id: "1", group: 1 },
            { id: "2", group: 1 },
            { id: "3", group: 1 },
            { id: "4", group: 1 }
        ],
        links: [
            { source: "0", target: "1", },
            { source: "0", target: "2", },
            { source: "0", target: "3", },
            { source: "0", target: "4", },
            { source: "1", target: "2", },
            { source: "1", target: "3", },
            { source: "1", target: "4", },
            { source: "2", target: "3", },
            { source: "2", target: "4", },
            { source: "3", target: "4", }
        ]
    },
    {
        nodes: [
            { id: "0", group: 1 },
            { id: "1", group: 1 },
            { id: "2", group: 1 },
            { id: "3", group: 1 },
            { id: "4", group: 1 }
        ],
        links: [
            { source: "0", target: "1", },
            { source: "1", target: "2", },
            { source: "2", target: "3", },
            { source: "3", target: "4", }
        ]
    },
    {
        nodes: [
            { id: "0", group: 1 },
            { id: "1", group: 1 },
            { id: "2", group: 1 },
            { id: "3", group: 1 },
            { id: "4", group: 1 }
        ],
        links: [
            { source: "0", target: "1", },
            { source: "0", target: "2", },
            { source: "0", target: "3", },
            { source: "0", target: "4", }
        ]
    },
]

const TheoryPage: React.FC<any> = () => {
    const parentRef = useRef(null);
    const [currentGraph, setCurrentGraph] = useState(0);
    useEffect(() => {
        if (parentRef) {
        }
    }, [currentGraph]);

    const changeVisualization = (prevNext: number) => {
        setCurrentGraph(prevTopic => {
            const currentTopic: number = prevTopic + prevNext
            return (currentTopic >= graphs.length || currentTopic < 0) ? 0 : currentTopic
        })
    }

    return (
        <div className={mainContainer}>
            <MainMenu />
            <div className={subContainer}>
                <div className={section}>
                    <div className="card-header">
                        Theory
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" className="btn btn-primary">Go somewhere</a>
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
                    <GraphCanvas graphData={graphs[currentGraph]}></GraphCanvas>
                </div>
            </div>
        </div>
    );
};

export default TheoryPage;