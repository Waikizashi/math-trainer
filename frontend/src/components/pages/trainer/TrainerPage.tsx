import React, { useEffect, useRef } from 'react';
import s from './trainerPage.module.css';
import cn from 'classnames';
import MainMenu from '../../navigation/Menu';
import GraphCanvas from '../../graphs/GraphCanvas';

const TrainerPage = () => {

    const segments = [
        { id: 1, value: 20, label: 'Segment one', className: 'progress-bar bg-info' },
        { id: 2, value: 20, label: 'Segment two', className: 'progress-bar bg-info' },
        { id: 3, value: 20, label: 'Segment three', className: 'progress-bar bg-info' },
    ];
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
                        <h5 className="card-title">Graphs beggining</h5>
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
}

export default TrainerPage;