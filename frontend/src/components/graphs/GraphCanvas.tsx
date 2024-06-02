import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import * as d3 from 'd3';
import s from './graphCanvas.module.css';
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
import SwipeUpAltIcon from '@mui/icons-material/SwipeUpAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PinIcon from '@mui/icons-material/Pin';
import AbcIcon from '@mui/icons-material/Abc';
import ClearIcon from '@mui/icons-material/Clear';

import { Alert, Button, Form, Modal } from 'react-bootstrap';
import NumberWithLineOrArrow from '../../utils/sub-components/NumberWithLineOrArrow';

interface Node extends d3.SimulationNodeDatum {
    nodeId: string;
    group?: string;
    degree?: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: Node;
    target: Node;
    weight?: null;
}

export interface GraphDataProps {
    title?: string;
    nodes: Node[];
    links: Link[];
    oriented?: boolean;
}

interface CanvasProps {
    parent?: string;
    scale?: number;
    matrixControl?: (matrixControlState: boolean) => void;
    getCurrentGraphData?: (currentGraphData: GraphDataProps) => void;
}

const nodeDefaultSize = 15;

const GraphCanvas: React.FC<{ graphData?: GraphDataProps, canvasPreferencies?: CanvasProps }> = ({ graphData, canvasPreferencies }) => {
    const location = useLocation();
    const isConstructorPage = location.pathname === '/constructor';

    const svgRef = useRef<any>(null);
    const canvasRef = useRef<any>(null);
    const simulationRef = useRef<any>(null);
    const [nodes, setNodes] = useState<Node[]>(graphData ? graphData.nodes : []);
    const [links, setLinks] = useState<Link[]>(graphData ? graphData.links : []);

    const [viewBox, setViewBox] = useState(`0 0 0 0`);

    const [addBtn, setAddBtn] = useState(false);
    const [settingsBtn, setSettingsBtn] = useState(false);
    const [matrixBtn, setMatrixBtn] = useState(false);
    const [showColors, setShowColors] = useState(false);
    const [linesBtn, setLinesBtn] = useState(false);
    const [weightBtn, setWeight] = useState(false);
    const [showDirections, setShowDirections] = useState(graphData?.oriented || false);
    const [swipeBtn, setSwipeBtn] = useState(false);
    const [scale, setScale] = useState(canvasPreferencies?.scale ? canvasPreferencies.scale : 1);
    const [nodeScale, setNodeScale] = useState(1);
    const [edgeLengthScale, setEdgeLengthScale] = useState(1);
    const [edgeSizeScale, setEdgeSizeScale] = useState(1);
    const [textScale, setTextScale] = useState(1);
    const [repulsiveForceScale, setRepulsiveForceScale] = useState(1);
    const [repulsiveDistanceScale, setRepulsiveDistanceScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [updateEvent, setUpdateEvent] = useState(false);
    const [nodeIdType, setNodeIdType] = useState<'number' | 'letter'>('number');

    const [nodeSource, setNodeSource] = useState<Node | null>(null);
    const [nodeTarget, setNodeTarget] = useState<Node | null>(null);

    const [currentNode, setCurrentNode] = useState<Node | null>(null);
    const [newNodeId, setNewNodeId] = useState('');
    const [isNodeModalOpen, setNodeModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [modalPosition, setModalPosition] = useState<{ x?: number, y?: number }>();

    const tempLinkRef = useRef<null | d3.Selection<SVGLineElement, unknown, null, undefined>>(null);

    const view = { x: 0, y: 0 };
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const updateSimulation = () => {
        canvasRef.current.selectAll('g>*').remove();
        setUpdateEvent(true);
    };

    const settingsHandle = () => {
        setSettingsBtn(!settingsBtn);
    };

    const zoomIn = () => {
        setScale(scale * 1.1);
    };

    const zoomOut = () => {
        setScale(scale / 1.1);
    };

    const addVertex = () => { };

    const clean = () => { };

    const cleanAll = () => {
        canvasRef.current.selectAll('g>*').remove();
        setNodes([]);
        setLinks([]);
    };

    const cleanCanvas = () => {
        canvasRef.current.selectAll('g>*').remove();
    };

    const showDegree = () => { };

    const showDegreeIndex = () => { };

    const setAdding = () => {
        setAddBtn(!addBtn);
    };

    const setMatrix = () => {
        setMatrixBtn(!matrixBtn);
    };

    const setColoring = () => {
        setShowColors(!showColors);
    };

    const setDirections = () => {
        setShowDirections(!showDirections);
    };

    const setLining = () => {
        setLinesBtn(!linesBtn);
        setSwipeBtn(false);
    };

    const setSwiping = () => {
        setSwipeBtn(!swipeBtn);
        setLinesBtn(false);
    };
    const setWeightDisplay = () => {
        setWeight(!weightBtn);
    };

    const updateViewBox = () => {
        if (svgRef.current) {
            const { width, height } = svgRef.current.parentNode.getBoundingClientRect();
        }
    };

    function createLoopPath(d: any, loopRadius = 150 * scale * (edgeLengthScale - edgeLengthScale / 2), offsetX = 0, offsetY = 0) {
        const loopPath = d3.path();
        loopPath.moveTo(d.x + offsetX, d.y + offsetY);
        const cp1x = d.x + offsetX + loopRadius;
        const cp1y = d.y + offsetY - loopRadius;
        const cp2x = d.x + offsetX - loopRadius;
        const cp2y = d.y + offsetY - loopRadius;
        const endX = d.x + offsetX;
        const endY = d.y + offsetY;

        // Рисуем кривую Безье для создания петли
        loopPath.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);

        return loopPath.toString();
    }

    function createPath(d: any, links: any) {
        const duplicates = links.filter((link: any) =>
            (link.source.nodeId === d.source.nodeId && link.target.nodeId === d.target.nodeId) ||
            (link.source.nodeId === d.target.nodeId && link.target.nodeId === d.source.nodeId)
        );

        const index = duplicates.indexOf(d);
        const total = duplicates.length;

        if (total > 1) {
            const curvature = 0.2;
            const amplitude = 20 * curvature * (index - (total - 1) / 2);
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy);

            return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,${(amplitude >= 0 ? 1 : 0)} ${d.target.x},${d.target.y}`;
        } else {
            return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
        }
    }

    const handleNodeClick = (event: any, node: Node) => {
        setCurrentNode(node);
        setNewNodeId(node.nodeId);
        setModalPosition({ x: node.x, y: node.y });
        setNodeModalOpen(true);
    };

    const handleNodeNameChange = () => {
        if (currentNode) {
            if (nodes.some(node => node.nodeId === newNodeId)) {
                setError(`Node [${newNodeId}] already exists.`);
                return;
            }

            const updatedNodes = nodes.map(node =>
                node.nodeId === currentNode.nodeId ? { ...node, nodeId: newNodeId } : node
            );
            const findNodeById = (nodeId: string) => {
                const matchingNode = updatedNodes.find(node => node.nodeId === nodeId);
                if (!matchingNode) {
                    throw new Error(`Node with nodeId ${nodeId} not found`);
                }
                return matchingNode;
            };

            const updatedLinks = links.map(link => ({
                ...link,
                source: link.source.nodeId === currentNode.nodeId ? findNodeById(newNodeId) : link.source,
                target: link.target.nodeId === currentNode.nodeId ? findNodeById(newNodeId) : link.target
            }));

            setNodes(updatedNodes);
            setLinks(updatedLinks);
            setNodeModalOpen(false);
            setError('');
        }
    };

    const assignNodeGroups = (nodes: Node[], links: Link[]) => {
        const nodeDegrees: { [key: string]: number } = {};

        links.forEach(link => {
            const sourceId = typeof link.source === 'string' ? link.source : link.source.nodeId;
            const targetId = typeof link.target === 'string' ? link.target : link.target.nodeId;

            if (!nodeDegrees[sourceId]) nodeDegrees[sourceId] = 0;
            if (!nodeDegrees[targetId]) nodeDegrees[targetId] = 0;

            nodeDegrees[sourceId]++;
            nodeDegrees[targetId]++;
        });

        nodes.forEach(node => {
            node.degree = nodeDegrees[node.nodeId] || 0;
            if (node.degree <= 1) {
                node.group = 'Low';
            } else if (node.degree <= 3) {
                node.group = 'Medium';
            } else {
                node.group = 'High';
            }
        });
    };

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
        canvasRef.current = svgElement;
    }, [window.screen.height, window.screen.width, scale]);

    const nodeSizeChange = (e: any) => {
        setNodeScale(e.target.value);
    };

    const edgeLengthChange = (e: any) => {
        setEdgeLengthScale(e.target.value);
    };

    const edgeSizeChange = (e: any) => {
        setEdgeSizeScale(e.target.value);
    };

    const textSizeChange = (e: any) => {
        setTextScale(e.target.value);
    };

    const repulsiveForceChange = (e: any) => {
        setRepulsiveForceScale(e.target.value);
    };

    const repulsiveDistanceChange = (e: any) => {
        setRepulsiveDistanceScale(e.target.value);
    };

    function getNextNodeId(): string {
        const existingIds = new Set(nodes.map(node => node.nodeId));
        if (nodeIdType === 'number') {
            let nextId = nodes.length;
            while (existingIds.has(nextId.toString())) {
                nextId++;
            }
            return nextId.toString();
        } else {
            let nextId = getNextLetterId('');
            while (existingIds.has(nextId)) {
                nextId = getNextLetterId(nextId);
            }
            return nextId;
        }
    }

    function getNextLetterId(currentId: string): string {
        if (currentId === '') return 'A';
        const endCharCode = 'Z'.charCodeAt(0);
        const charCodes = Array.from(currentId).map(char => char.charCodeAt(0));
        let index = charCodes.length - 1;
        while (index >= 0) {
            if (charCodes[index] < endCharCode) {
                charCodes[index]++;
                return String.fromCharCode(...charCodes);
            }
            charCodes[index] = 'A'.charCodeAt(0);
            index--;
        }
        charCodes.unshift('A'.charCodeAt(0));
        return String.fromCharCode(...charCodes);
    }

    useEffect(() => { }, [settingsBtn]);

    useEffect(() => {
        if (canvasRef.current) {
            if (addBtn) {
                setLinesBtn(false);
                canvasRef.current.on('click', (event: any) => {
                    const coords = d3.pointer(event);
                    const newNodeId = getNextNodeId();
                    const newNode: Node = {
                        nodeId: newNodeId,
                        group: (0).toString(),
                        x: coords[0],
                        y: coords[1],
                        vx: 0,
                        vy: 0,
                    };
                    setNodes(prevNodes => [...prevNodes, newNode]);
                    updateSimulation();
                });
            } else {
                canvasRef.current.on('click', null);
            }
        }
    }, [addBtn, nodes, nodeIdType]);

    useEffect(() => { }, [nodeSource]);

    useEffect(() => {
        if (nodeSource?.nodeId && nodeTarget?.nodeId) {
            const newLink: Link = { source: nodeSource, target: nodeTarget };
            setNodes(prevNodes => [...prevNodes]);
            setLinks(prevLinks => [...prevLinks, newLink]);
            updateSimulation();
        }
    }, [nodeTarget]);

    useEffect(() => {
        if (!linesBtn) return;
        setAddBtn(false);
        const startTempLine = (event: any) => {
            if (event.button !== 0) return;
            const targetElement = d3.select(event.target);

            const sourceNode: any = targetElement.datum();
            if (sourceNode === undefined) return;
            setNodeSource(sourceNode);
            tempLinkRef.current = canvasRef.current.append('line')
                .attr('class', 'temp-line')
                .attr('x1', sourceNode.x)
                .attr('y1', sourceNode.y)
                .attr('x2', sourceNode.x)
                .attr('y2', sourceNode.y)
                .attr('stroke', 'grey')
                .attr('stroke-width', 3)
                .style('pointer-events', 'none')
                .attr('stroke-linecap', 'round')
                .attr('marker-end', showDirections ? 'url(#arrow)' : null);
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
                setNodeTarget(targetNode);
            }

            if (tempLinkRef.current) tempLinkRef.current.remove();
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
    }, [linesBtn, isDragging]);

    useEffect(() => {
        canvasPreferencies?.matrixControl && canvasPreferencies.matrixControl(matrixBtn);
    }, [matrixBtn]);

    useEffect(() => {
        if (canvasRef.current) { }
    }, [linesBtn]);
    useEffect(() => {

    }, [weightBtn]);

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
    }, [swipeBtn]);

    useEffect(() => {
        canvasRef.current.selectAll('.link')
            .attr('marker-end', showDirections ? 'url(#arrow)' : null);
    }, [showDirections]);

    useEffect(() => {
        cleanAll();
        setNodes(graphData ? graphData.nodes : []);
        setLinks(graphData ? graphData.links : []);
        setShowDirections(graphData?.oriented || false); // Установка значения showDirections из graphData
    }, [graphData]);

    useEffect(() => {
        assignNodeGroups(nodes, links);
        cleanCanvas();
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
            .attr('stroke-linecap', 'round')
            .attr('marker-end', showDirections ? 'url(#arrow)' : null)
            .on("contextmenu", (event: any, d: any) => {
                event.preventDefault();
                const updatedLinks = links.filter(link => link !== d);
                setLinks(updatedLinks);
                updateSimulation();
            });

        const nodeElements = canvasRef.current.append('g')
            .selectAll('circle')
            .data(nodes, (d: any) => d.nodeId)
            .enter()
            .append('circle')
            .attr('r', nodeDefaultSize * nodeScale)
            .attr('class', 'node')
            .style('fill', showColors ? (d: any) => colorScale(d.degree) : 'black')
            .on("click", (event: any, d: any) => {
                event.stopPropagation();
                handleNodeClick(event, d);
            })
            .on("contextmenu", (event: any, d: any) => {
                event.preventDefault();
                const updatedNodes = nodes.filter(node => node.nodeId !== d.nodeId);
                const updatedLinks = links.filter((link: any) => link.source.nodeId !== d.nodeId && link.target.nodeId !== d.nodeId);
                setNodes(updatedNodes);
                setLinks(updatedLinks);
                updateSimulation();
            });

        const textElements = canvasRef.current.append('g')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .attr('dy', '.15em')
            .attr('class', 'node-number')
            .text((d: any) => d.nodeId)
            .style('font-size', `${12 * textScale}px`)
            .style('pointer-events', 'none')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle');

        simulationRef.current = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id((d: any) => d.nodeId).distance(100 * scale * edgeLengthScale))
            .force("charge", d3.forceManyBody()
                .strength(-50 * repulsiveForceScale)
                .distanceMax(50 * repulsiveDistanceScale))
            .force('center', !updateEvent ? d3.forceCenter(
                w / 2,
                h / 2
            ) : () => {
                setUpdateEvent(false);
                return null;
            })
            .on('tick', () => {
                linkElements
                    .attr('d', (d: any) => {
                        if (d.source.nodeId === d.target.nodeId) {
                            const loopPath = createLoopPath(d.source);
                            return loopPath;
                        } else {
                            return createPath(d, links);
                        }
                    });
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
    }, [
        nodes,
        showColors,
        links,
        viewBox,
        scale,
        nodeScale,
        edgeLengthScale,
        edgeSizeScale,
        textScale,
        repulsiveDistanceScale,
        repulsiveForceScale,
    ]);

    useEffect(() => {
        canvasPreferencies?.getCurrentGraphData && canvasPreferencies.getCurrentGraphData({ nodes, links });
    }, [nodes, links]);

    const constructorArea = cn(
        "card",
        "text-center",
        'h-100',
        'w-100',
        !isConstructorPage ? 'border-0' : 'mx-2',
    );

    const tools = cn();

    const tool = cn(
        "mx-2",
    );

    const canvasStyles = cn(
        'graph-canvas',
    );

    const rangeControlStyle = cn(
        "mb-0",
        "form-label",
        "text-primary-emphasis",
        "d-flex",
        "justify-content-between"
    );

    return (
        <div onContextMenu={e => e.preventDefault()} className={constructorArea}>
            <div className="card-header d-flex justify-content-between">
                <strong className='my-auto'>{'canvas'.toUpperCase()}</strong>
                <div className={tools}>
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
                    <Fab color={showColors === true ? 'primary' : 'default'}
                        onClick={setColoring}
                        className={tool} size='small'>
                        <ColorLensIcon></ColorLensIcon>
                    </Fab>
                    <Fab
                        color={nodeIdType === 'number' ? 'success' : 'warning'}
                        onClick={() => setNodeIdType(nodeIdType === 'number' ? 'letter' : 'number')}
                        className={tool} size='small'>
                        {nodeIdType === 'number' ? <PinIcon /> : <AbcIcon />}
                    </Fab>
                    <Fab onClick={cleanAll} className={tool} size='small'>
                        <DeleteForeverIcon></DeleteForeverIcon>
                    </Fab>
                    <Fab color={linesBtn === true ? 'primary' : 'default'}
                        onClick={() => setLining()}
                        className={tool} size='small'>
                        <TimelineIcon></TimelineIcon>
                    </Fab>
                    <Fab color={weightBtn === true ? 'primary' : 'default'}
                        onClick={() => setWeightDisplay()}
                        className={tool} size='small'>
                        <NumberWithLineOrArrow lineColor={weightBtn} />
                    </Fab>
                    <Fab color={showDirections ? 'primary' : 'default'}
                        onClick={() => setDirections()}
                        className={tool} size='small'>
                        <SwipeUpAltIcon></SwipeUpAltIcon>
                    </Fab>
                    <Fab className={tool} size='small'>
                        <AutoFixOffIcon></AutoFixOffIcon>
                    </Fab>
                    <Fab color={swipeBtn === true ? 'primary' : 'default'}
                        onClick={() => setSwiping()}
                        className={tool} size='small'>
                        <SwipeVerticalIcon></SwipeVerticalIcon>
                    </Fab>
                    <div hidden={isConstructorPage ? false : true} className="btn-group dropstart">
                        <Fab onClick={settingsHandle} type="button" className={cn("btn dropdown-toggle", tool, s.beforeOff)} data-bs-toggle="dropdown" aria-expanded="false" size='small'>
                            <SettingsIcon></SettingsIcon>
                        </Fab>
                        <ul style={{ width: "max-content", zIndex: 1111 }} className="dropdown-menu mx-2 p-2 border-primary border-1">
                            <li>
                                <div className={rangeControlStyle}>Node size:
                                    <output className='mx-1'>{nodeScale}</output>
                                </div>
                                <input onChange={nodeSizeChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                            </li>
                            <li>
                                <div className={rangeControlStyle}>Edge length:
                                    <output className='mx-1'>{edgeLengthScale}</output>
                                </div>
                                <input onChange={edgeLengthChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                            </li>
                            <li>
                                <div className={rangeControlStyle}>Edge size:
                                    <output className='mx-1'>{edgeSizeScale}</output>
                                </div>
                                <input onChange={edgeSizeChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                            </li>
                            <li>
                                <div className={rangeControlStyle}>Text size:
                                    <output className='mx-1'>{textScale}</output>
                                </div>
                                <input onChange={textSizeChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                            </li>
                            <li>
                                <div className={rangeControlStyle}>Repulsive distance:
                                    <output className='mx-1'>{repulsiveDistanceScale}</output>
                                </div>
                                <input onChange={repulsiveDistanceChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                            </li>
                            <li>
                                <div className={rangeControlStyle}>Repulsive force:
                                    <output className='mx-1'>{repulsiveForceScale}</output>
                                </div>
                                <input onChange={repulsiveForceChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={visualArea}>
                <svg className={canvasStyles} ref={svgRef} viewBox={viewBox}>
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" strokeWidth="0.5" />
                        </pattern>
                        <marker id="arrow" markerWidth="4" markerHeight="4" refX={nodeDefaultSize * nodeScale / 2 / 2 + 3} refY="2" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,4 L4,2 z" fill="#aaa" />
                        </marker>
                    </defs>
                    <rect x={-10000} y={-10000} width="20000" height="20000" fill="url(#grid)" />
                </svg>
            </div>
            <div className="card-footer text-body-secondary"></div>
            <Modal
                backdrop={false}
                show={isNodeModalOpen}
                onHide={() => setNodeModalOpen(false)}
                style={{
                    width: "fit-content",
                    position: 'absolute',
                    top: `${modalPosition?.y}px`,
                    left: `${modalPosition?.x}px`,
                    maxWidth: '150px'
                }}
            >
                <div className='modal-c-border m-0'>
                    <Modal.Body className='p-1'>
                        {error && (
                            <Alert variant="danger" className='text-center'>
                                {error}
                            </Alert>
                        )}
                        <Form>
                            <Form.Group controlId="formNodeId">
                                <Form.Label className='w-100 d-flex justify-content-center'>Node-id</Form.Label>
                                <Form.Control
                                    className='text-center'
                                    type="text"
                                    value={newNodeId}
                                    onChange={(e) => setNewNodeId(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className='p-1 justify-content-between'>
                        <Fab color='error'
                            onClick={() => { setNodeModalOpen(false); setError('') }}
                            className={cn(s.customSmallFab, tool)} size='small'>
                            <HighlightOffIcon className={cn(s.customSmalIcon)}></HighlightOffIcon>
                        </Fab>
                        <Fab color='success'
                            onClick={handleNodeNameChange}
                            className={cn(s.customSmallFab, tool)} size='small'>
                            <CheckCircleIcon className={cn(s.customSmalIcon)}></CheckCircleIcon>
                        </Fab>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
};

export default GraphCanvas;
