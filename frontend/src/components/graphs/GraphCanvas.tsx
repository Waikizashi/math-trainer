import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames'
import * as d3 from 'd3'
import s from './graphCanvas.module.css'
import { useLocation } from 'react-router-dom';
import { visualArea } from '../../utils/styles/global-styles';

import Fab from '@mui/material/Fab';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TimelineIcon from '@mui/icons-material/Timeline';
import AutoFixOffIcon from '@mui/icons-material/AutoFixOff';
import SwipeVerticalIcon from '@mui/icons-material/SwipeVertical';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import AppsIcon from '@mui/icons-material/Apps';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface Node extends d3.SimulationNodeDatum {
    id: string,
    group?: string
    degree?: number
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | Node;
    target: string | Node;
}

export interface GraphDataProps {
    nodes: Node[];
    links: Link[];

}
interface CanvasProps {
    parent?: string,
    matrixControl?: (matrixControlState: boolean) => void;
}

const GraphCanvas: React.FC<{ graphData?: GraphDataProps, canvasPreferencies?: CanvasProps }> = ({ graphData, canvasPreferencies }) => {
    const location = useLocation();
    const isConstructorPage = location.pathname === '/constructor';

    const svgRef = useRef<any>(null);
    const canvasRef = useRef<any>(null);
    const simulationRef = useRef<any>(null);
    const [nodes, setNodes] = useState<Node[]>(graphData ? graphData.nodes : []);
    const [links, setLinks] = useState<Link[]>(graphData ? graphData.links : []);

    const [viewBox, setViewBox] = useState(`0 0 0 0`);

    const [addBtn, setAddBtn] = useState(false)
    const [settingsBtn, setSettingsBtn] = useState(false)
    const [matrixBtn, setMatrixBtn] = useState(false)
    const [colorsBtn, setColorsBtn] = useState(false)
    const [linesBtn, setLinesBtn] = useState(false)
    const [swipeBtn, setSwipeBtn] = useState(false)
    const [scale, setScale] = useState(1);
    const [nodeScale, setNodeScale] = useState(1);
    const [edgeLengthScale, setEdgeLengthScale] = useState(1);
    const [edgeSizeScale, setEdgeSizeScale] = useState(1);
    const [textScale, setTextScale] = useState(1);
    const [repulsiveForceScale, setRepulsiveForceScale] = useState(1);
    const [repulsiveDistanceScale, setRepulsiveDistanceScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [updateEvent, setUpdateEvent] = useState(false);
    const [nodeSource, setNodeSource] = useState<Node | null>(null);
    const [nodeTarget, setNodeTarget] = useState<Node | null>(null);
    const tempLinkRef = useRef<null | d3.Selection<SVGLineElement, unknown, null, undefined>>(null);

    const view = { x: 0, y: 0 };
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const updateSimulation = () => {
        canvasRef.current.selectAll('g>*').remove();
        // simulationRef.current.nodes(nodes);
        // console.log(canvasRef.current)
        setUpdateEvent(true)
        // simulationRef.current.force("link", d3.forceLink(links).id((d: any) => d.id));


    };
    const settingsHandle = () => {
        setSettingsBtn(!settingsBtn);
    }
    const zoomIn = () => {
        setScale(scale * 1.1);
    }
    const zoomOut = () => {
        setScale(scale / 1.1);
    }
    const addVertex = () => {

    }

    const clean = () => {

    }

    const cleanAll = () => {
        canvasRef.current.selectAll('g>*').remove();
        setNodes([])
        setLinks([])
    }
    const cleanCanvas = () => {
        canvasRef.current.selectAll('g>*').remove();
    }

    const showDegree = () => {

    }

    const showDegreeIndex = () => {

    }

    const setAdding = () => {
        setAddBtn(!addBtn)
    }
    const setMatrix = () => {
        setMatrixBtn(!matrixBtn)
    }
    const setColoring = () => {
        setColorsBtn(!colorsBtn)
    }
    const setLining = () => {
        setLinesBtn(!linesBtn)
        setSwipeBtn(false)
    }
    const setSwiping = () => {
        setSwipeBtn(!swipeBtn)
        setLinesBtn(false)
    }

    const updateViewBox = () => {
        if (svgRef.current) {
            const { width, height } = svgRef.current.parentNode.getBoundingClientRect();
            // setViewBox(`0 0 ${width} ${height}`);
            // setViewBox(`0 0 ${width} ${height}`);
        }
    };
    function createLoopPath(d: any, loopRadius = 75 * scale * (edgeLengthScale - edgeLengthScale / 2), offsetX = 0, offsetY = 0) {
        const loopPath = d3.path();
        loopPath.moveTo(d.x + offsetX, d.y + offsetY); // Стартовая точка на вершине

        // Контрольные точки и конечная точка для кривой Безье
        const cp1x = d.x + offsetX + loopRadius; // Контрольная точка 1 по оси X
        const cp1y = d.y + offsetY - loopRadius; // Контрольная точка 1 по оси Y
        const cp2x = d.x + offsetX - loopRadius; // Контрольная точка 2 по оси X
        const cp2y = d.y + offsetY - loopRadius; // Контрольная точка 2 по оси Y
        const endX = d.x + offsetX; // Конечная точка по оси X (вернуться к исходной вершине)
        const endY = d.y + offsetY; // Конечная точка по оси Y (вернуться к исходной вершине)

        // Рисуем кривую Безье для создания петли
        loopPath.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);

        return loopPath.toString();
    }
    useEffect(() => {
        if (!svgRef.current) return;

        const svgElement = d3.select(svgRef.current);
        const { width, height } = svgElement.node().getBoundingClientRect();
        const newViewBox = [
            (width / 2) - (width / 2 / scale),
            (height / 2) - (height / 2 / scale),
            width / scale,
            height / scale,
        ].join(' ');

        svgElement.attr('viewBox', newViewBox);
        canvasRef.current = svgElement
    }, [window.screen.height, window.screen.width, scale]);


    const nodeSizeChange = (e: any) => {
        setNodeScale(e.target.value)
    }
    const edgeLengthChange = (e: any) => {
        setEdgeLengthScale(e.target.value)
    }
    const edgeSizeChange = (e: any) => {
        setEdgeSizeScale(e.target.value)
    }
    const textSizeChange = (e: any) => {
        setTextScale(e.target.value)
    }
    const repulsiveForceChange = (e: any) => {
        setRepulsiveForceScale(e.target.value)
    }
    const repulsiveDistanceChange = (e: any) => {
        setRepulsiveDistanceScale(e.target.value)
    }

    useEffect(() => {

    }, [settingsBtn])

    useEffect(() => {
        if (canvasRef.current) {
            if (addBtn) {
                setLinesBtn(false)
                canvasRef.current.on('click', (event: any) => {
                    const coords = d3.pointer(event);
                    const newNode: Node = {
                        id: nodes.length.toString(),
                        group: (0).toString(),
                        x: coords[0],
                        y: coords[1],
                    };
                    setNodes(prevNodes => [...prevNodes, newNode]);
                    updateSimulation()
                });
            } else {
                canvasRef.current.on('click', null)
            }
        }
    }, [addBtn, nodes])

    useEffect(() => {
        // // console.log('state source: ', nodeSource)
    }, [nodeSource])

    useEffect(() => {
        if (nodeSource?.id && nodeTarget?.id) {

            const newLink: Link = { source: nodeSource.id, target: nodeTarget.id }
            setNodes(prevNodes => [...prevNodes])
            setLinks(prevLinks => [...prevLinks, newLink]);
            updateSimulation()
        }
    }, [nodeTarget])
    
    useEffect(() => {
        if (!linesBtn) return;
        setAddBtn(false)
        const startTempLine = (event: any) => {
            // console.log('mousedown')
            const targetElement = d3.select(event.target);

            const sourceNode: any = targetElement.datum();
            if (sourceNode === undefined) return;
            setNodeSource(sourceNode)
            tempLinkRef.current = canvasRef.current.append('line')
                .attr('class', 'temp-line')
                .attr('x1', sourceNode.x)
                .attr('y1', sourceNode.y)
                .attr('x2', sourceNode.x)
                .attr('y2', sourceNode.y)
                .attr('stroke', 'grey')
                .attr('stroke-width', 3)
                .style('pointer-events', 'none')
                .attr('stroke-linecap', 'round');
            setIsDragging(true);
        };

        const moveTempLine = (e: any) => {
            if (!isDragging || !tempLinkRef.current) return;

            const coords = d3.pointer(e);
            tempLinkRef.current
                .attr('x2', coords[0])
                .attr('y2', coords[1]);
        };

        const endTempLine = (event: any) => {
            if (!isDragging) return;

            const targetElement = d3.select(event.target);
            const targetNode: any = targetElement.datum();
            if (targetElement.datum() && targetElement.classed('node')) {
                setNodeTarget(targetNode)
            }

            if (tempLinkRef.current) tempLinkRef.current.remove();
            // console.log('mouseup')
            setIsDragging(false);
        };

        canvasRef.current.on('mousedown', startTempLine);
        canvasRef.current.on('mousemove', moveTempLine);
        canvasRef.current.on('mouseup', endTempLine);
        return () => {
            canvasRef.current.on('mousedown', null);
            canvasRef.current.on('mousemove', null);
            canvasRef.current.on('mouseup', null);
        };
    }, [linesBtn, isDragging])

    useEffect(() => {
        if (canvasRef.current) {

        }
    }, [colorsBtn])
    useEffect(() => {
        canvasPreferencies?.matrixControl && canvasPreferencies.matrixControl(matrixBtn)
    }, [matrixBtn])
    useEffect(() => {
        if (canvasRef.current) {

        }
    }, [linesBtn])
    useEffect(() => {
        if (canvasRef.current) {
            const dragHandler = d3.drag<SVGSVGElement, unknown>()
                .on('start', function (event) {
                    view.x = event.x;
                    view.y = event.y;
                })
                .on('drag', function (event) {
                    const dx = event.x - view.x;
                    const dy = event.y - view.y;
                    view.x = event.x;
                    view.y = event.y;

                    const viewBox = canvasRef.current.attr('viewBox').split(' ').map(Number);
                    viewBox[0] -= dx;
                    viewBox[1] -= dy;
                    canvasRef.current.attr('viewBox', viewBox.join(' '));
                });
            if (swipeBtn) {
                dragHandler(canvasRef.current);
            } else {
                canvasRef.current.on('.drag', null);
            }
        }
    }, [swipeBtn])

    useEffect(() => {
        cleanAll()
        setNodes(graphData ? graphData.nodes : [])
        setLinks(graphData ? graphData.links : [])
    }, [graphData])

    useEffect(() => {
        cleanCanvas()
        const w = svgRef.current.parentNode.getBoundingClientRect().width;
        const h = svgRef.current.parentNode.getBoundingClientRect().height;

        const linkElements = canvasRef.current.append('g')
            .selectAll('path')
            .data(links)
            .enter()
            .append('path')
            .attr('fill', 'none')
            .attr('class', 'link')
            .attr('stroke', '#aaa')
            .attr('stroke-width', 4 * edgeSizeScale)
            .attr('stroke-linecap', 'round');

        const nodeElements = canvasRef.current.append('g')
            .selectAll('circle')
            .data(nodes, (d: any) => d.id)
            .enter()
            .append('circle')
            .attr('r', 15 * nodeScale)
            .attr('class', 'node')
            .style('fill', (d: any) => colorScale(d.group))

        const textElements = canvasRef.current.append('g')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .attr('dy', '.15em')
            .attr('class', 'node-number')
            .text((d: any) => d.id)
            .style('font-size', `${12 * textScale}px`)
            .style('pointer-events', 'none')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle');

        simulationRef.current = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100 * scale * edgeLengthScale))
            .force("charge", d3.forceManyBody()
                .strength(-50 * repulsiveForceScale)
                .distanceMax(50 * repulsiveDistanceScale))
            .force('center', !updateEvent ? d3.forceCenter(
                w / 2,
                h / 2
            ) : () => {
                setUpdateEvent(false)
                return null
            }
            )
            .on('tick', () => {
                linkElements
                    .attr('d', (d: any) => {
                        if (d.source.id === d.target.id) {
                            const loopPath = createLoopPath(d.source);
                            return loopPath;
                        } else {
                            return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
                        }
                    });
                // linkElements
                //     .attr('x1', (d: any) => d.source.x)
                //     .attr('y1', (d: any) => d.source.y)
                //     .attr('x2', (d: any) => d.target.x)
                //     .attr('y2', (d: any) => d.target.y)

                nodeElements
                    .attr('cx', (d: any) => d.x)
                    .attr('cy', (d: any) => d.y);

                textElements
                    .attr('x', (d: any) => d.x)
                    .attr('y', (d: any) => d.y);
            });
        return () => {
            simulationRef.current.stop();
        };

    }, [nodes,
        links,
        viewBox,
        scale,
        nodeScale,
        edgeLengthScale,
        edgeSizeScale,
        textScale,
        repulsiveDistanceScale,
        repulsiveForceScale,]);

    const constructorArea = cn(
        "card",
        "text-center",
        'h-100',
        'w-100',
        !isConstructorPage ? 'border-0' : 'mx-2',
    )

    const tools = cn(

    )
    const tool = cn(
        "mx-2",
    )
    const canvasStyles = cn(
        'graph-canvas',
        'bg-light'
    )
    const rangeControlStyle = cn(
        "mb-0",
        "form-label",
        "text-primary-emphasis",
        "d-flex",
        "justify-content-between"
    )


    return (
        <div className={constructorArea}>
            <div className="card-header d-flex justify-content-between">
                <strong className='my-auto'>{'canvas'.toUpperCase()}</strong>
                <div className={tools}>
                    <div hidden={isConstructorPage ? false : true} className="btn-group dropstart">
                        <Fab onClick={settingsHandle} type="button" className={cn("btn dropdown-toggle", tool, s.beforeOff)} data-bs-toggle="dropdown" aria-expanded="false" size='small'>
                            <SettingsIcon></SettingsIcon>
                        </Fab>
                        <ul style={{width: "max-content"}} className="dropdown-menu mx-2 p-2 border-primary border-2">
                            <li>
                                <div className={rangeControlStyle}>Node size:
                                    <output className='mx-1'>{nodeScale}</output>
                                    {/* <RestartAltIcon></RestartAltIcon> */}
                                </div>
                                <input onChange={nodeSizeChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                            </li>
                            <li>
                                <div className={rangeControlStyle}>Edge length:
                                    <output className='mx-1'>{edgeLengthScale}</output>
                                    {/* <RestartAltIcon></RestartAltIcon> */}
                                </div>
                                <input onChange={edgeLengthChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                            </li>
                            <li>
                                <div className={rangeControlStyle}>Edge size:
                                    <output className='mx-1'>{edgeSizeScale}</output>
                                    {/* <RestartAltIcon></RestartAltIcon> */}
                                </div>
                                <input onChange={edgeSizeChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                            </li>
                            <li>
                                <div className={rangeControlStyle}>Text size:
                                    <output className='mx-1'>{textScale}</output>
                                    {/* <RestartAltIcon></RestartAltIcon> */}
                                </div>
                                <input onChange={textSizeChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                            </li>
                            <li>
                                <div className={rangeControlStyle}>Repulsive distance:
                                    <output className='mx-1'>{repulsiveDistanceScale}</output>
                                    {/* <RestartAltIcon></RestartAltIcon> */}
                                </div>
                                <input onChange={repulsiveDistanceChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                            </li>
                            <li>
                                <div className={rangeControlStyle}>Repulsive force:
                                    <output className='mx-1'>{repulsiveForceScale}</output>
                                    {/* <RestartAltIcon></RestartAltIcon> */}
                                </div>
                                <input onChange={repulsiveForceChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                            </li>
                        </ul>
                    </div>

                    <Fab onClick={zoomIn} className={tool} size='small'>
                        <ZoomInIcon></ZoomInIcon>
                    </Fab>
                    <Fab onClick={zoomOut} className={tool} size='small'>
                        <ZoomOutIcon></ZoomOutIcon>
                    </Fab>
                    <Fab color={addBtn === true ? 'primary' : 'default'}
                        onClick={setAdding}
                        className={tool} size='small'>
                        <AddCircleOutlineIcon></AddCircleOutlineIcon>
                    </Fab>
                    <Fab hidden={isConstructorPage ? false : true} color={matrixBtn === true ? 'primary' : 'default'}
                        onClick={setMatrix}
                        className={tool} size='small'>
                        <AppsIcon></AppsIcon>
                    </Fab>
                    <Fab color={colorsBtn === true ? 'primary' : 'default'}
                        onClick={setColoring}
                        className={tool} size='small'>
                        <ColorLensIcon></ColorLensIcon>
                    </Fab>
                    <Fab onClick={cleanAll} className={tool} size='small'>
                        <DeleteForeverIcon></DeleteForeverIcon>
                    </Fab>
                    <Fab color={linesBtn === true ? 'primary' : 'default'}
                        onClick={() => setLining()}
                        className={tool} size='small'>
                        <TimelineIcon></TimelineIcon>
                    </Fab>
                    <Fab className={tool} size='small'>
                        <AutoFixOffIcon></AutoFixOffIcon>
                    </Fab>
                    <Fab color={swipeBtn === true ? 'primary' : 'default'}
                        onClick={() => setSwiping()}
                        className={tool} size='small'>
                        <SwipeVerticalIcon></SwipeVerticalIcon>
                    </Fab>
                </div>
            </div>
            <div className={visualArea}>
                <svg className={canvasStyles} ref={svgRef} viewBox={viewBox}></svg>
            </div>
            <div className="card-footer text-body-secondary">
            </div>
        </div>
    )


};

export default GraphCanvas;
