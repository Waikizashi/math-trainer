import React, { useEffect, useRef } from 'react';
import s from './theoryPage.module.css';
import cn from 'classnames';
import MainMenu from '../../components/navigation/Menu';

const Constructor = () => {
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
        'h-100',
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
        'w-100',
    )
    return (
        <div className={mainContainer}>
            <MainMenu />
            <div className={subContainer}>
                <div className={section}>
                    <div className="card-header">
                        Constructor
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                    <div className="card-footer text-body-secondary">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Constructor;