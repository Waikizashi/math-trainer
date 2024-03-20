import React, { useEffect, useRef } from 'react';
import s from './theoryPage.module.css';
import cn from 'classnames';
import MainMenu from '../../navigation/Menu';

import { mainContainer, subContainer } from '../../../utils/styles/global-styles';
import GraphCanvas from '../../graphs/GraphCanvas';

const ConstructorPage = () => {
    const parentRef = useRef(null);
    useEffect(() => {
        if (parentRef) {
        }
    }, []);

    return (
        <div className={mainContainer}>
            <MainMenu />
            <div className={subContainer}>
                <GraphCanvas></GraphCanvas>
            </div>
        </div>
    );
}

export default ConstructorPage;