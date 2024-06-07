import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import * as d3 from 'd3';
import s from './graphCanvas.module.css';
import { useLocation } from 'react-router-dom';
import { visualArea } from '../../utils/styles/global-styles';
import ControlPanel from './ControlPanel';
import ExportMenu from './ExportMenu';

import Fab from '@mui/material/Fab';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Alert, Button, Form, Modal } from 'react-bootstrap';
import GraphInfo from './GraphInfo';
import { useCenter } from '../../context/CenterContext';

export interface Node extends d3.SimulationNodeDatum {
    nodeId: string;
    group?: string;
    degree?: number;
}

export interface Link extends d3.SimulationLinkDatum<Node> {
    source: Node;
    target: Node;
    weight?: number | null;
    linkId?: string;
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
const linkDefaultLength = 100;

const GraphCanvas: React.FC<{ graphData?: GraphDataProps, canvasPreferencies?: CanvasProps }> = ({ graphData, canvasPreferencies }) => {
    const location = useLocation();
    const isFullControl = Boolean(location.pathname.match(/^\/constructor(\/.*)?$/));
    const isPartControl = Boolean(location.pathname.match(/^\/practice(\/\d+)?$/));





    const svgRef = useRef<any>(null);
    const canvasRef = useRef<any>(null);
    const simulationRef = useRef<any>(null);
    const [nodes, setNodes] = useState<Node[]>(graphData ? graphData.nodes : []);
    const [links, setLinks] = useState<Link[]>(graphData ? graphData.links : []);
    const [currentGraphData, setCurrentGraphData] = useState<GraphDataProps | undefined>(graphData);

    const [viewBox, setViewBox] = useState(`0 0 0 0`);

    const [addBtn, setAddBtn] = useState(false);
    const [settingsBtn, setSettingsBtn] = useState(false);
    const [matrixBtn, setMatrixBtn] = useState(false);
    const [showColors, setShowColors] = useState(false);
    const [linesBtn, setLinesBtn] = useState(false);
    const [weightBtn, setWeight] = useState(false);
    const [showLinkIds, setShowLinkIds] = useState(false);
    const [showDirections, setShowDirections] = useState(graphData?.oriented || false);
    const [swipeBtn, setSwipeBtn] = useState(false);
    const [draggingEnabled, setDraggingEnabled] = useState(false);
    const [showDegree, setShowDegree] = useState(false);
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

    const [nodeSource, setNodeSource] = useState<Node>();
    const [nodeTarget, setNodeTarget] = useState<Node>();

    const [currentNode, setCurrentNode] = useState<Node | null>(null);
    const [currentLink, setCurrentLink] = useState<Link | null>(null);
    const [newNodeId, setNewNodeId] = useState('');
    const [newLinkId, setNewLinkId] = useState('');
    const [newWeight, setNewWeight] = useState('');
    const [isNodeModalOpen, setNodeModalOpen] = useState(false);
    const [isLinkModalOpen, setLinkModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [modalPosition, setModalPosition] = useState<{ x?: number, y?: number }>();

    const tempLinkRef = useRef<null | d3.Selection<SVGLineElement, unknown, null, undefined>>(null);

    const { setCenter } = useCenter();
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

    const cleanAll = () => {
        canvasRef.current.selectAll('g>*').remove();
        setNodes([]);
        setLinks([]);
    };

    const cleanCanvas = () => {
        canvasRef.current.selectAll('g>*').remove();
    };

    const setAdding = () => {
        setAddBtn(!addBtn);
        setLinesBtn(false);
        setSwipeBtn(false);
        setDraggingEnabled(false);
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
        setAddBtn(false);
        setSwipeBtn(false);
        setDraggingEnabled(false);
    };

    const setSwiping = () => {
        setSwipeBtn(!swipeBtn);
        setLinesBtn(false);
        setAddBtn(false);
        setDraggingEnabled(false);
    };

    const setWeightDisplay = () => {
        setWeight(!weightBtn);
    };

    const setLinkIdDisplay = () => {
        setShowLinkIds(!showLinkIds);
    };

    const setDegreeDisplay = () => {
        setShowDegree(!showDegree);
    };

    const enableDragging = () => {
        setDraggingEnabled(!draggingEnabled);
        setAddBtn(false);
        setSwipeBtn(false);
        setLinesBtn(false);
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

    const deleteNode = (node: Node | null) => {
        if (node) {
            const updatedNodes = nodes.filter(n => n.nodeId !== node.nodeId);
            const updatedLinks = links.filter(link => link.source.nodeId !== node.nodeId && link.target.nodeId !== node.nodeId);
            setNodes(updatedNodes);
            setLinks(updatedLinks);
            updateSimulation();
            setNodeModalOpen(false);
        }
    };

    const deleteLink = (link: Link | null) => {
        if (link) {
            const updatedLinks = links.filter(l => l !== link);
            setLinks(updatedLinks);
            updateSimulation();
            setLinkModalOpen(false);
        }
    };

    const handleNodeClick = (event: any, node: Node) => {
        let xpos = node.x;
        if (xpos !== undefined) {
            xpos = isPartControl ? xpos * 2 : xpos
        }

        setCurrentNode(node);
        setNewNodeId(node.nodeId);
        setModalPosition({ x: xpos, y: node.y });
        setNodeModalOpen(true);
        setLinkModalOpen(false);
    };

    const handleLinkClick = (event: any, link: Link) => {
        let xpos = (link.source as Node).x
        if (xpos !== undefined) {
            xpos = isPartControl ? xpos * 2 : xpos
        }
        setCurrentLink(link);
        setNewLinkId(link.linkId || '');
        setNewWeight(link.weight?.toString() || '');
        setModalPosition({ x: xpos, y: (link.source as Node).y });
        setLinkModalOpen(true);
        setNodeModalOpen(false);
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

    const handleLinkChange = () => {
        if (currentLink) {
            const updatedLinks = links.map(link =>
                link === currentLink ? {
                    ...link,
                    linkId: newLinkId,
                    weight: newWeight ? parseFloat(newWeight) : null,
                } : link
            );
            setLinks(updatedLinks);
            setLinkModalOpen(false);
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
        setCenter(width / 2, height / 2);
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
                setSwipeBtn(false);
                setDraggingEnabled(false);
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
        setSwipeBtn(false);
        setDraggingEnabled(false);
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
            if (targetNode === undefined) return
            setNodeTarget(targetNode);

            if (tempLinkRef.current) tempLinkRef.current.remove();
            setIsDragging(false);
            // canvasRef.current.on('mousedown', null);
            // canvasRef.current.on('mousemove', null);
            // canvasRef.current.on('mouseup', null);
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
        if (canvasRef.current) {
            const dragHandler = d3.drag<SVGCircleElement, Node>()
                .on('start', function (event, d) {
                    if (!draggingEnabled) return;
                    if (!event.active) simulationRef.current.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on('drag', function (event, d) {
                    if (!draggingEnabled) return;
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on('end', function (event, d) {
                    if (!draggingEnabled) return;
                    if (!event.active) simulationRef.current.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                });
            if (draggingEnabled) {
                dragHandler(canvasRef.current.selectAll('.node'));
            } else {
                canvasRef.current.selectAll('.node').on('.drag', null);
            }
        }
    }, [draggingEnabled]);

    useEffect(() => {
        canvasRef.current.selectAll('.link')
            .attr('marker-end', showDirections ? 'url(#arrow)' : null);
    }, [showDirections]);

    useEffect(() => {
        cleanAll();
        setNodes(graphData ? graphData.nodes : []);
        setLinks(graphData ? graphData.links : []);
        setShowDirections(graphData?.oriented || false);
        setCurrentGraphData(graphData)
    }, [graphData]);

    useEffect(() => { }, [currentGraphData]);

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
                if (isFullControl || isPartControl) {
                    event.preventDefault();
                    handleLinkClick(event, d);
                }
            });

        const nodeElements = canvasRef.current.append('g')
            .selectAll('circle')
            .data(nodes, (d: any) => d.nodeId)
            .enter()
            .append('circle')
            .attr('r', nodeDefaultSize * nodeScale)
            .attr('class', 'node')
            .style('fill', showColors ? (d: any) => colorScale(d.degree) : 'black')
            .on("contextmenu", (event: any, d: any) => {
                if (isFullControl || isPartControl) {
                    event.preventDefault();
                    handleNodeClick(event, d);
                }
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

        const degreeElements = canvasRef.current.append('g')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .attr('dy', '.15em')
            .attr('class', 'node-degree')
            .text((d: any) => d.degree)
            .style('font-size', `${12 * textScale}px`)
            .style('pointer-events', 'none')
            .style('fill', 'red')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'middle')
            .attr('dx', nodeDefaultSize * nodeScale);

        const linkIdElements = canvasRef.current.append('g')
            .selectAll('text')
            .data(links)
            .enter().append('text')
            .attr('dy', `-4px`)
            .attr('class', 'link-id')
            .text((d: any) => d.linkId ? `{${d.linkId}}` : '*')
            .style('font-size', `${15 * textScale}px`)
            .style('pointer-events', 'none')
            .style('fill', 'blue')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')

        const linkWeightElements = canvasRef.current.append('g')
            .selectAll('text')
            .data(links)
            .enter().append('text')
            .attr('dy', `6px`)
            .attr('class', 'link-weight')
            .text((d: any) => d.weight ? `[${d.weight}]` : '0')
            .style('font-size', `${15 * textScale}px`)
            .style('pointer-events', 'none')
            .style('fill', 'green')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')


        simulationRef.current = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id((d: any) => d.nodeId).distance(linkDefaultLength * scale * edgeLengthScale))
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

                degreeElements
                    .attr('x', (d: any) => d.x)
                    .attr('y', (d: any) => d.y)
                    .style('display', showDegree ? 'block' : 'none');

                linkIdElements
                    .attr('x', (d: any) => d.source && d.target ? (((d.source as Node).x || 0) + ((d.target as Node).x || 0)) / 2 + 6 * edgeSizeScale : 0)
                    .attr('y', (d: any) => d.source && d.target ? (((d.source as Node).y || 0) + ((d.target as Node).y || 0)) / 2 - 6 * edgeSizeScale : 0)
                    .style('display', showLinkIds ? 'block' : 'none');

                linkWeightElements
                    .attr('x', (d: any) => d.source && d.target ? (((d.source as Node).x || 0) + ((d.target as Node).x || 0)) / 2 - 6 * edgeSizeScale : 0)
                    .attr('y', (d: any) => d.source && d.target ? (((d.source as Node).y || 0) + ((d.target as Node).y || 0)) / 2 + 6 * edgeSizeScale : 0)
                    .style('display', weightBtn ? 'block' : 'none');
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
        showDegree,
        showLinkIds,
        weightBtn,
    ]);

    useEffect(() => {
        canvasPreferencies?.getCurrentGraphData && canvasPreferencies.getCurrentGraphData({ nodes, links });
        setCurrentGraphData({ nodes, links });
    }, [nodes, links]);

    const constructorArea = cn(
        'shadow',
        "card",
        "text-center",
        'h-100',
        'w-100',
        !isFullControl ? 'border-0' : 'mx-2',
    );


    const formControl = cn(
        "mx-1",
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
        <div style={{ position: 'relative' }} onContextMenu={e => e.preventDefault()} className={constructorArea}>
            <ControlPanel
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                setAdding={setAdding}
                setMatrix={setMatrix}
                setColoring={setColoring}
                setNodeIdType={() => setNodeIdType(nodeIdType === 'number' ? 'letter' : 'number')}
                cleanAll={cleanAll}
                setLining={setLining}
                setWeightDisplay={setWeightDisplay}
                setLinkIdDisplay={setLinkIdDisplay}
                setDegreeDisplay={setDegreeDisplay}
                setDirections={setDirections}
                setSwiping={setSwiping}
                enableDragging={enableDragging}
                settingsHandle={settingsHandle}
                addBtn={addBtn}
                matrixBtn={matrixBtn}
                showColors={showColors}
                nodeIdType={nodeIdType}
                linesBtn={linesBtn}
                weightBtn={weightBtn}
                showLinkIds={showLinkIds}
                showDirections={showDirections}
                swipeBtn={swipeBtn}
                showDegree={showDegree}
                draggingEnabled={draggingEnabled}
                isFullControl={isFullControl}
                isPartControl={isPartControl}
                s={s}
                rangeControlStyle={rangeControlStyle}
                nodeScale={nodeScale}
                edgeLengthScale={edgeLengthScale}
                edgeSizeScale={edgeSizeScale}
                textScale={textScale}
                repulsiveDistanceScale={repulsiveDistanceScale}
                repulsiveForceScale={repulsiveForceScale}
                nodeSizeChange={nodeSizeChange}
                edgeLengthChange={edgeLengthChange}
                edgeSizeChange={edgeSizeChange}
                textSizeChange={textSizeChange}
                repulsiveDistanceChange={repulsiveDistanceChange}
                repulsiveForceChange={repulsiveForceChange}
            />
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
                            onClick={() => { deleteNode(currentNode); setError('') }}
                            className={cn(s.customSmallFab, formControl)} size='small'>
                            <HighlightOffIcon className={cn(s.customSmalIcon)}></HighlightOffIcon>
                        </Fab>
                        <Fab color='warning'
                            onClick={() => { setNodeModalOpen(false); setError('') }}
                            className={cn(s.customSmallFab, formControl)} size='small'>
                            <ArrowBackIcon className={cn(s.customSmalIcon)}></ArrowBackIcon>
                        </Fab>
                        <Fab color='success'
                            onClick={handleNodeNameChange}
                            className={cn(s.customSmallFab, formControl)} size='small'>
                            <CheckCircleIcon className={cn(s.customSmalIcon)}></CheckCircleIcon>
                        </Fab>
                    </Modal.Footer>
                </div>
            </Modal>
            <Modal
                backdrop={false}
                show={isLinkModalOpen}
                onHide={() => setLinkModalOpen(false)}
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
                            <Form.Group controlId="formLinkId">
                                <Form.Label className='w-100 d-flex justify-content-center'>Link-id</Form.Label>
                                <Form.Control
                                    className='text-center'
                                    type="text"
                                    value={newLinkId}
                                    onChange={(e) => setNewLinkId(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formWeight">
                                <Form.Label className='w-100 d-flex justify-content-center'>Weight</Form.Label>
                                <Form.Control
                                    className='text-center'
                                    type="number"
                                    value={newWeight}
                                    onChange={(e) => setNewWeight(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className='p-1 justify-content-between'>
                        <Fab color='error'
                            onClick={() => { deleteLink(currentLink); setError('') }}
                            className={cn(s.customSmallFab, formControl)} size='small'>
                            <HighlightOffIcon className={cn(s.customSmalIcon)}></HighlightOffIcon>
                        </Fab>
                        <Fab color='warning'
                            onClick={() => { setLinkModalOpen(false); setError('') }}
                            className={cn(s.customSmallFab, formControl)} size='small'>
                            <ArrowBackIcon className={cn(s.customSmalIcon)}></ArrowBackIcon>
                        </Fab>
                        <Fab color='success'
                            onClick={handleLinkChange}
                            className={cn(s.customSmallFab, formControl)} size='small'>
                            <CheckCircleIcon className={cn(s.customSmalIcon)}></CheckCircleIcon>
                        </Fab>
                    </Modal.Footer>
                </div>
            </Modal>
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
            <div className="card-footer text-body-secondary">
                <GraphInfo currentGraphData={currentGraphData}></GraphInfo>
                <ExportMenu svgRef={svgRef} />
            </div>
        </div>
    );
};

export default GraphCanvas;
