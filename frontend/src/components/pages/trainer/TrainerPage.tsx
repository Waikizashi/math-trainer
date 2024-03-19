import React, { useEffect, useRef } from 'react';
import s from './trainerPage.module.css';
import cn from 'classnames';
import MainMenu from '../../navigation/Menu';

const TrainerPage = () => {
    const parentRef = useRef(null);
    useEffect(() => {
        if (parentRef) {
        }
    }, []);
    const mainContainer = cn(
        'main-container',
        'd-flex',
        'flex-column',
        'justify-content-center',
        'align-items-center',
        'w-100',
        'h-100'
    )
    const subContainer = cn(
        'd-flex',
        'justify-content-center',
        'align-items-center',
        'w-100',
        'h-100',
        'my-2'
    )
    const section = cn(
        "card",
        "text-center",
        "mx-2",
        'h-100',
        'w-50'
    )
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
                    <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrainerPage;