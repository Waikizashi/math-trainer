import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames'
import * as d3 from 'd3'
import s from 'graph-canvas.module.css'
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface Node extends d3.SimulationNodeDatum {
    id: number | string,
    group?: number
    degree?: number
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | number | Node;
    target: string | number | Node;
}

interface GraphParams {

}

const GraphCanvas = () => {
    const location = useLocation();
    const isConstructorPage = location.pathname === '/constructor';

    const svgRef = useRef<any>(null);
    const canvasRef = useRef<any>(null);
    const simulationRef = useRef<any>(null);
    const [nodes, setNodes] = useState<Node[]>([
        { id: 0, group: 1 },
        { id: 1, group: 2 },
        { id: 2, group: 3 },
        { id: 3, group: 4 },
        { id: 4, group: 5 },
        { id: 5, group: 6 },
        { id: 6, group: 7 },
    ]);
    const [links, setLinks] = useState<Link[]>([
        { source: 0, target: 1 },
        { source: 1, target: 2 },
        { source: 2, target: 3 },
        { source: 3, target: 4 },
        { source: 4, target: 0 },
    ]);
    const [viewBox, setViewBox] = useState('0 0 0 0');

    const [addBtn, setAddBtn] = useState(false)
    const [colorsBtn, setColorsBtn] = useState(false)
    const [linesBtn, setLinesBtn] = useState(false)
    const [swipeBtn, setSwipeBtn] = useState(false)
    const [scale, setScale] = useState(1);

    const view = { x: 0, y: 0 };
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const updateSimulation = () => {
        canvasRef.current.selectAll('g>*').remove();
        simulationRef.current.nodes(nodes);
        console.log(canvasRef.current)
        // const linkForce = simulationRef.current.force("link", d3.forceLink(links).id((d: any) => d.id));

        const link = canvasRef.current.append('g')
            .selectAll('line')
            .data(links, (d: any) => `${d.source.id}-${d.target.id}`);
        link.enter()
            .append('line')
            .style('stroke', '#aaa')
            .merge(link);
        link.exit().remove();

        const node = canvasRef.current.append('g')
            .selectAll('circle')
            .data(nodes, (d: any) => d.id);
        node.enter()
            .append('circle')
            .attr('r', 10)
            .style('fill', (d: any) => colorScale(d.group))
            .merge(node);
        node.exit().remove();

        const text = canvasRef.current.append('g')
            .selectAll('text')
            .data(nodes, (d: any) => d.id);
        text.enter()
            .append('text')
            .attr('dx', 12)
            .attr('dy', '.35em')
            .text((d: any) => d.id)
            .style('font-size', '12px')
            .merge(text);
        text.exit().remove();

    };
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

    }

    const showDegree = () => {

    }

    const showDegreeIndex = () => {

    }

    const setAdding = () => {
        setAddBtn(!addBtn)
    }
    const setColoring = () => {
        setColorsBtn(!colorsBtn)
    }
    const setLining = () => {
        setLinesBtn(!linesBtn)
    }
    const setSwiping = () => {
        setSwipeBtn(!swipeBtn)
    }

    const updateViewBox = () => {
        if (svgRef.current) {
            const { width, height } = svgRef.current.parentNode.getBoundingClientRect();
            setViewBox(`0 0 ${width} ${height}`);
        }
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
        canvasRef.current = svgElement
    }, [scale]);

    useEffect(() => {
        if (canvasRef.current) {
            if (addBtn) {
                canvasRef.current.on('click', (event: any) => {
                    const coords = d3.pointer(event);
                    const newNode: Node = {
                        id: nodes.length,
                        group: Math.floor(Math.random() * 10),
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
    }, [addBtn])
    useEffect(() => {
        if (canvasRef.current) {

        }
    }, [colorsBtn])
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
        const w = svgRef.current.parentNode.getBoundingClientRect().width;
        const h = svgRef.current.parentNode.getBoundingClientRect().height;
        window.addEventListener('resize', updateViewBox);
        updateViewBox();
        canvasRef.current = d3.select(svgRef.current)
            .attr('width', '100%')
            .attr('height', '100%');

        const linkElements = canvasRef.current.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .style('stroke', '#aaa');

        const nodeElements = canvasRef.current.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', 10)
            .style('fill', (d: any) => colorScale(d.group));

        const textElements = canvasRef.current.append('g')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .attr('dx', 12)
            .attr('dy', '.35em')
            .text((d: any) => d.id)
            .style('font-size', '12px');

        simulationRef.current = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
            .force("charge", d3.forceManyBody()
                .strength(-50)
                .distanceMax(100))
            .force('center', d3.forceCenter(
                w / 2,
                h / 2
            ))
            .on('tick', () => {
                linkElements
                    .attr('x1', (d: any) => d.source.x)
                    .attr('y1', (d: any) => d.source.y)
                    .attr('x2', (d: any) => d.target.x)
                    .attr('y2', (d: any) => d.target.y)

                nodeElements
                    .attr('cx', (d: any) => d.x)
                    .attr('cy', (d: any) => d.y);

                textElements
                    .attr('x', (d: any) => d.x)
                    .attr('y', (d: any) => d.y);
            });

    }, [nodes, links]);

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

    return (
        <div className={constructorArea}>
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
                    <Fab color={colorsBtn === true ? 'primary' : 'default'}
                        onClick={setColoring}
                        className={tool} size='small'>
                        <ColorLensIcon></ColorLensIcon>
                    </Fab>
                    <Fab className={tool} size='small'>
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
