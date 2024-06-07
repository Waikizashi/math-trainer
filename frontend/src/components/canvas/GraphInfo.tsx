import React, { useEffect, useState } from 'react';
import {
    isGraphConnected,
    findGraphRadius,
    findGraphDiameter,
    isAcyclic,
    findChromaticNumber,
    isBipartite,
    isTree,
    isComplete,
    isEulerian,
    isHamiltonian,
    findBridges
} from '../../utils/graph-analyze-utils';
import { GraphDataProps } from './GraphCanvas';
import { Collapse } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';

interface GraphInfoProps {
    currentGraphData?: GraphDataProps;
}

const GraphInfo: React.FC<GraphInfoProps> = ({ currentGraphData = { title: 'Untitled', nodes: [], links: [] } }) => {
    const [connectedStatus, setConnStatus] = useState<string>('');
    const [radius, setRadius] = useState<number | undefined>(undefined);
    const [diameter, setDiameter] = useState<number | undefined>(undefined);
    const [acyclicStatus, setAcyclicStatus] = useState<string>('');
    const [chromaticNumber, setChromaticNumber] = useState<number | undefined>(undefined);
    const [bipartiteStatus, setBipartiteStatus] = useState<string>('');
    const [treeStatus, setTreeStatus] = useState<string>('');
    const [completeStatus, setCompleteStatus] = useState<string>('');
    const [eulerianStatus, setEulerianStatus] = useState<string>('');
    const [hamiltonianStatus, setHamiltonianStatus] = useState<string>('');
    const [bridges, setBridges] = useState<Array<{ from: string, to: string }> | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const { translations } = useLanguage();

    useEffect(() => {
        setConnStatus(isGraphConnected(currentGraphData) ? 'Súvislý graf' : 'Nesúvislý graf');
        setRadius(findGraphRadius(currentGraphData));
        setDiameter(findGraphDiameter(currentGraphData));
        setAcyclicStatus(isAcyclic(currentGraphData) ? 'Acyklický' : 'Cyklický');
        setChromaticNumber(findChromaticNumber(currentGraphData));
        setBipartiteStatus(isBipartite(currentGraphData) ? 'Bipartitný' : 'Nie bipartitný');
        setTreeStatus(isTree(currentGraphData) ? 'Strom' : 'Nie strom');
        setCompleteStatus(isComplete(currentGraphData) ? 'Kompletný' : 'Nie kompletný');
        setEulerianStatus(isEulerian(currentGraphData) ? 'Eulerovský' : 'Nie eulerovský');
        setHamiltonianStatus(isHamiltonian(currentGraphData) ? 'Hamiltonovský' : 'Nie hamiltonovský');
        setBridges(findBridges(currentGraphData));
    }, [currentGraphData]);

    return (
        <div className='w-100 card bottom-0 start-0 position-absolute bg-light bg-opacity-25 border border-primary border-bottom-0 rounded'>
            <Collapse in={open}>
                <div className="list-container card-body bg-info bg-opacity-10 py-2">
                    {currentGraphData.title && <h5 className="card-title">{currentGraphData.title}</h5>}
                    <div className="row">
                        <div className="col-md-4">
                            <ul className="list-group m-0">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <strong className='m-1'>Súvislosť:</strong>
                                    <span className="badge m-1 bg-primary rounded-pill">{connectedStatus}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <strong className='m-1'>Bipartitný:</strong>
                                    <span className="badge m-1 bg-primary rounded-pill">{bipartiteStatus}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <strong className='m-1'>Kompletný:</strong>
                                    <span className="badge m-1 bg-primary rounded-pill">{completeStatus}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <strong className='m-1'>Strom:</strong>
                                    <span className="badge m-1 bg-primary rounded-pill">{treeStatus}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <ul className="list-group m-0">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <strong className='m-1'>Mosty:</strong>
                                    <span className="badge m-1 bg-primary rounded-pill">{bridges ? bridges.map(b => `${b.from}-${b.to}`).join(', ') : 'Nedostupné'}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <strong className='m-1'>Cyklicita:</strong>
                                    <span className="badge m-1 bg-primary rounded-pill">{acyclicStatus}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <strong className='m-1'>Eulerovský:</strong>
                                    <span className="badge m-1 bg-primary rounded-pill">{eulerianStatus}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <strong className='m-1'>Hamiltonovský:</strong>
                                    <span className="badge m-1 bg-primary rounded-pill">{hamiltonianStatus}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <ul className="list-group m-0">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <strong className='m-1'>Radius:</strong>
                                    <span className="badge m-1 bg-primary rounded-pill">{radius ?? 'Nedostupné'}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <strong className='m-1'>Diametr:</strong>
                                    <span className="badge m-1 bg-primary rounded-pill">{diameter ?? 'Nedostupné'}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <strong className='m-1'>Chromatické číslo:</strong>
                                    <span className="badge m-1 bg-primary rounded-pill">{chromaticNumber ?? 'Nedostupné'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </Collapse>
            <div
                className="card-footer bg-primary text-white p-0 m-0"
                onClick={() => setOpen(!open)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
            >
                {open ? translations.hideGraphPanel : translations.showGraphPanel}
            </div>
        </div>
    );
};

export default GraphInfo;
