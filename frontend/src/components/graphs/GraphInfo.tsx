import React, { useEffect, useRef, useState } from 'react';
import { isGraphConnected, findGraphRadius, findGraphDiameter, isAcyclic, findChromaticNumber } from '../../utils/graph-analyze-utils';
import { GraphDataProps } from './GraphCanvas';

interface GraphInfoProps {
    currentGraphData?: GraphDataProps
}

const GraphInfo: React.FC<GraphInfoProps> = ({ currentGraphData = { title: 'Untitled', nodes: [], links: [] } }) => {
    const [connectedStatus, setConnStatus] = useState(isGraphConnected(currentGraphData) ? 'Súvislý graf' : 'Nesúvislý graf');
    const [radius, setRadius] = useState<number | undefined>(undefined);
    const [diameter, setDiameter] = useState<number | undefined>(undefined);
    const [acyclicStatus, setAcyclicStatus] = useState(isAcyclic(currentGraphData) ? 'Acyklický' : 'Cyklický');
    const [chromaticNumber, setChromaticNumber] = useState<number | undefined>(undefined);

    useEffect(() => {
        setConnStatus(isGraphConnected(currentGraphData) ? 'Súvislý graf' : 'Nesúvislý graf');
        setRadius(findGraphRadius(currentGraphData));
        setDiameter(findGraphDiameter(currentGraphData));
        setAcyclicStatus(isAcyclic(currentGraphData) ? 'Acyklický' : 'Cyklický');
        setChromaticNumber(findChromaticNumber(currentGraphData));
    }, [currentGraphData]);

    return (
        <div className="container m-1 w-100">
            <div className="card">
                <div className="card-body">
                    {currentGraphData.title && <h5 className="card-title">{currentGraphData.title}</h5>}
                    <div className="row">
                        <div className="col-md-4">
                            <ul className="list-unstyled">
                                <li><strong>Súvislosť:</strong> {connectedStatus}</li>
                                <li><strong>Radius:</strong> {radius ?? 'Nedostupné'}</li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <ul className="list-unstyled">
                                <li><strong>Diametr:</strong> {diameter ?? 'Nedostupné'}</li>
                                <li><strong>Cyklicita:</strong> {acyclicStatus}</li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <ul className="list-unstyled">
                                <li><strong>Chromatické číslo:</strong> {chromaticNumber ?? 'Nedostupné'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default GraphInfo;
