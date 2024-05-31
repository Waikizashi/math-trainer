import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import s from './constructor.module.css';
import cn from 'classnames';
import MainMenu from '../../navigation/Menu';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { mainContainer, subContainer } from '../../../utils/styles/global-styles';
import GraphCanvas, { GraphDataProps } from '../../graphs/GraphCanvas';
import Matrix from './Matrix';
import GraphInfo from '../../graphs/GraphInfo';

const ConstructorPage = () => {
    const parentRef = useRef(null);

    const [graphData, setGraphData] = useState<GraphDataProps | undefined>(undefined);
    const [currentGraphData, setCurrentGraphData] = useState<GraphDataProps | undefined>(undefined);
    const [matrixControlState, setMatrixControlState] = useState(false);

    const changeMatrixControlState = (state: boolean) => {
        setMatrixControlState(state)
    }

    const changeGraphData = (currentGraphData: GraphDataProps) => {
        setCurrentGraphData(currentGraphData)
    }

    useEffect(() => { }, [graphData]);
    useEffect(() => { }, [currentGraphData]);

    const handleMatrixChange = (graphData: any) => {
        setGraphData(graphData);
    }

    useEffect(() => {
        if (parentRef) { }
    }, [matrixControlState]);

    return (
        <div className={mainContainer} ref={parentRef}>
            <MainMenu />
            <div className={subContainer}>
                <Draggable
                    bounds="parent"
                    handle=".card-header"
                >
                    <div hidden={!matrixControlState} className="card position-absolute" style={{ top: 65, left: 15, width: 'auto', zIndex: 99 }}>
                        <div className="card-header" style={{ cursor: 'move' }}>
                        </div>
                        <div className="card-body">
                            <Matrix onMatrixChange={handleMatrixChange}></Matrix>
                        </div>
                    </div>
                </Draggable>
                <GraphCanvas
                    graphData={graphData}
                    canvasPreferencies={{
                        matrixControl: changeMatrixControlState,
                        getCurrentGraphData: changeGraphData
                    }}
                ></GraphCanvas>
            </div>
            <GraphInfo currentGraphData={currentGraphData}></GraphInfo>
        </div>
    );
}

export default ConstructorPage;
