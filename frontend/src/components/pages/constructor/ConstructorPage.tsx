import React, { useEffect, useRef, useState } from 'react';
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

    const [graphTemplate, setGraphTemplate] = useState<GraphDataProps | undefined>(undefined);
    const [currentGraphData, setCurrentGraphData] = useState<GraphDataProps | undefined>(undefined);
    const [matrixControlState, setMatrixControlState] = useState(false);
    const changeMatrixControlState = (state: boolean) => {
        setMatrixControlState(state)
    }
    const changeGraphTemplate = (currentGraphDatas: GraphDataProps) => {
        console.log("CURRENT_GRAPH_DATA: ", currentGraphDatas)
        setCurrentGraphData(currentGraphDatas)

    }

    useEffect(() => {

    }, [graphTemplate])
    useEffect(() => {

    }, [currentGraphData])

    const handleMatrixChange = (graphData: any) => {
        setGraphTemplate(graphData);
    }

    useEffect(() => {
        if (parentRef) {
        }
    }, [matrixControlState]);

    return (
        <div className={mainContainer}>
            <MainMenu />
            <div className={subContainer}>
                <div hidden={!matrixControlState} className="card position-absolute" style={{ top: 65, left: 15, width: 'auto', zIndex: 99 }}>
                    <div className="card-body">

                        <Matrix onMatrixChange={handleMatrixChange}></Matrix>
                    </div>
                </div>
                <GraphCanvas

                    graphData={graphTemplate}
                    canvasPreferencies={{
                        matrixControl: changeMatrixControlState,
                        getCurrentGraphData: changeGraphTemplate
                    }}></GraphCanvas>
            </div>
            <GraphInfo currentGraphData={currentGraphData}></GraphInfo>
        </div>
    );
}

export default ConstructorPage;