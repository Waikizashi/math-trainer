import React, { useEffect, useRef } from 'react';
import s from './theoryPage.module.css';
import cn from 'classnames';
import Fab from '@mui/material/Fab';
import GraphCanvas from '../../graphs/GraphCanvas';
import MainMenu from '../../navigation/Menu';

import { mainContainer, subContainer, section, visualArea } from '../../../utils/styles/global-styles';

interface MyComponentProps {
    title: string;
    description?: string;
}

const TheoryPage: React.FC<any> = () => {
    const parentRef = useRef(null);
    useEffect(() => {
        if (parentRef) {
        }
    }, []);

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
                                    <a className="page-link" href="#" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item">
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
                    <GraphCanvas></GraphCanvas>
                </div>
            </div>
        </div>
    );
};

export default TheoryPage;