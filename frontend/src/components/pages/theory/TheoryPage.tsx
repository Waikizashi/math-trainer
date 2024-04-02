import React, { useEffect, useRef, useState } from 'react';
import s from './theoryPage.module.css';
import cn from 'classnames';
import Fab from '@mui/material/Fab';
import GraphCanvas, { GraphDataProps } from '../../graphs/GraphCanvas';
import MainMenu from '../../navigation/Menu';

import { mainContainer, subContainer, section, visualArea } from '../../../utils/styles/global-styles';
import { graphs } from '../../../data/graphs';


const TheoryPage: React.FC<any> = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const cardHeaderRef = useRef<HTMLDivElement>(null);
    const [bodyHeight, setBH] = useState(0)
    const [currentGraph, setCurrentGraph] = useState(0);
    useEffect(() => {
    }, [currentGraph]);

    const changeVisualization = (prevNext: number) => {
        setCurrentGraph(prevTopic => {
            const currentTopic: number = prevTopic + prevNext
            return (currentTopic >= graphs.length || currentTopic < 0) ? 0 : currentTopic
        })
    }

    const segments = [
        { id: 1, value: 20, label: 'Segment one', className: 'progress-bar bg-success' },
        { id: 2, value: 20, label: 'Segment two', className: 'progress-bar bg-success' },
        { id: 3, value: 20, label: 'Segment three', className: 'progress-bar bg-success' },
    ];

    return (
        <div className={mainContainer} >
            <MainMenu />
            <div className={subContainer}>
                <div className={section} style={{ maxHeight: "845px" }}>
                    <div className="card-header">
                        Theory
                    </div>
                    <div className="card-body overflow-auto">
                        <h3 className="card-title">Introduction to Graph Theory</h3>
                        <div>
                            <section>
                                <h2>Basic Definitions</h2>
                                <p>Graph theory is a branch of mathematics that studies graphs, which are mathematical structures used to model pairwise relations between objects. A graph <em>G</em> consists of a set of vertices <em>V</em>, and a set of edges <em>E</em>, which connect pairs of vertices.</p>
                            </section>
                            <section>
                                <h2>Types of Graphs</h2>
                                <ul>
                                    <li><strong>Undirected graphs</strong> - graphs in which edges have no direction.</li>
                                    <li><strong>Directed graphs (digraphs)</strong> - graphs where each edge has a direction.</li>
                                    <li><strong>Weighted graphs</strong> - graphs in which each edge is assigned a value or weight.</li>
                                </ul>
                            </section>
                            <section>
                                <h2>Applications of Graphs</h2>
                                <p>Graphs are widely used in computer science, social sciences, biology, network technologies, and many other fields. They are used to model communication networks, paths of travel, relations between entities, and much more.</p>
                            </section>
                        </div><div>
                            <h1>Introduction to Graph Theory</h1>
                            <section>
                                <h2>Basic Definitions</h2>
                                <p>Graph theory is a branch of mathematics that studies graphs, which are mathematical structures used to model pairwise relations between objects. A graph <em>G</em> consists of a set of vertices <em>V</em>, and a set of edges <em>E</em>, which connect pairs of vertices.</p>
                            </section>
                            <section>
                                <h2>Types of Graphs</h2>
                                <ul>
                                    <li><strong>Undirected graphs</strong> - graphs in which edges have no direction.</li>
                                    <li><strong>Directed graphs (digraphs)</strong> - graphs where each edge has a direction.</li>
                                    <li><strong>Weighted graphs</strong> - graphs in which each edge is assigned a value or weight.</li>
                                </ul>
                            </section>
                            <section>
                                <h2>Applications of Graphs</h2>
                                <p>Graphs are widely used in computer science, social sciences, biology, network technologies, and many other fields. They are used to model communication networks, paths of travel, relations between entities, and much more.</p>
                            </section>
                        </div>
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

export default TheoryPage;