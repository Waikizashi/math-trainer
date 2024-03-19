import React, { useEffect, useRef } from 'react';
import s from './theoryPage.module.css';
import cn from 'classnames';
import MainMenu from '../../navigation/Menu';

import Fab from '@mui/material/Fab';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TimelineIcon from '@mui/icons-material/Timeline';
import AutoFixOffIcon from '@mui/icons-material/AutoFixOff';
import SwipeVerticalIcon from '@mui/icons-material/SwipeVertical';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { mainContainer, subContainer, visualArea } from '../../../utils/styles/global-styles';
import GraphCanvas from '../../graphs/GraphCanvas';

const Constructor = () => {
    const parentRef = useRef(null);
    useEffect(() => {
        if (parentRef) {
        }
    }, []);
    
    const constructorArea = cn(
        "card",
        "text-center",
        "mx-2",
        'h-100',
        'w-100',
    )
    const tools = cn(
        
    )
    const tool = cn(
        "mx-2",
    )

    return (
        <div className={mainContainer}>
            <MainMenu />
            <div className={subContainer}>
                <div className={constructorArea}>
                    <div className="card-header d-flex justify-content-between">
                        <strong className='my-auto'>Constructor</strong>
                        <div className={tools}>
                            <Fab className={tool} size='small'>
                                <ZoomInIcon></ZoomInIcon>
                            </Fab>
                            <Fab className={tool} size='small'>
                                <ZoomOutIcon></ZoomOutIcon>
                            </Fab>
                            <Fab className={tool} size='small'>
                                <ColorLensIcon></ColorLensIcon>
                            </Fab>
                            <Fab className={tool} size='small'>
                                <DeleteForeverIcon></DeleteForeverIcon>
                            </Fab>
                            <Fab className={tool} size='small'>
                                <TimelineIcon></TimelineIcon>
                            </Fab>
                            <Fab className={tool} size='small'>
                                <AutoFixOffIcon></AutoFixOffIcon>
                            </Fab>
                            <Fab className={tool} size='small'>
                                <SwipeVerticalIcon></SwipeVerticalIcon>
                            </Fab>
                        </div>
                    </div>
                    <div className={visualArea}>
                        <GraphCanvas></GraphCanvas>
                    </div>
                    <div className="card-footer text-body-secondary">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Constructor;