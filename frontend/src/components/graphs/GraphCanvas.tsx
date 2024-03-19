import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames'
import * as d3 from 'd3'
import s from 'graph-canvas.module.css'

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
    const centerForceStrength = 0.005;

    const svgRef = useRef<any>(null);
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
    const [svg, setSvg] = useState();
    const [dragHandler, setDragHandler] = useState();
    const [simulation, setSimulation] = useState();
    const [viewBox, setViewBox] = useState();
    const [viewBox, setViewBox] = useState();

    const updateViewBox = () => {
        if (svgRef.current) {
            const { width, height } = svgRef.current.parentNode.getBoundingClientRect();
            setViewBox(`0 0 ${width} ${height}`);
        }
    };
    const view = { x: 0, y: 0 };

    useEffect(() => {
        const w = svgRef.current.parentNode.getBoundingClientRect().width;
        const h = svgRef.current.parentNode.getBoundingClientRect().height;
        window.addEventListener('resize', updateViewBox);
        updateViewBox();

        const svg = d3.select(svgRef.current)
            .attr('width', '100%')
            .attr('height', '100%');

        if (svg) {
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

                    const viewBox = svg.attr('viewBox').split(' ').map(Number);
                    viewBox[0] -= dx;
                    viewBox[1] -= dy;
                    svg.attr('viewBox', viewBox.join(' '));
                });

            dragHandler(svg);
        }

        // const nodes: Node[] = ;

        // const links: Link[] = ;


        const linkElements = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .style('stroke', '#aaa');

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const nodeElements = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', 10)
            .style('fill', (d: any) => colorScale(d.group));

        const textElements = svg.append('g')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .attr('dx', 12)
            .attr('dy', '.35em')
            .text(d => d.id)
            .style('font-size', '12px');

        const simulation = d3.forceSimulation(nodes)
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

        svg.on('click', (event) => {
            // Преобразуем координаты клика в координаты SVG с учетом текущего viewBox
            const coords = d3.pointer(event);
            const newNode: Node = {
                id: nodes.length,
                group: Math.floor(Math.random() * 10), // Пример группы для нового узла
                x: coords[0],
                y: coords[1],
            };
            setNodes(prevNodes => [...prevNodes, newNode]);
            console.log(nodes)
            updateSimulation();
        });
        const updateSimulation = () => {
            svg.selectAll('g > *').remove();
            simulation.nodes(nodes);
            // const linkForce = simulation.force("link", d3.forceLink(links).id((d: any) => d.id));

            const link = svg.select<SVGAElement>('g')
                .selectAll<SVGLineElement, Link>('line')
                .data(links, (d: any) => `${d.source.id}-${d.target.id}`);
            link.enter()
                .append('line')
                .style('stroke', '#aaa')
                .merge(link);
            link.exit().remove();

            const node = svg.select('g')
                .selectAll<SVGCircleElement, Node>('circle')
                .data(nodes, (d: any) => d.id);
            node.enter()
                .append('circle')
                .attr('r', 10)
                .style('fill', (d: any) => colorScale(d.group))
                .merge(node);
            node.exit().remove();

            const text = svg.select('g')
                .selectAll<SVGTextElement, Node>('text')
                .data(nodes, (d: any) => d.id);
            text.enter()
                .append('text')
                .attr('dx', 12)
                .attr('dy', '.35em')
                .text(d => d.id)
                .style('font-size', '12px')
                .merge(text);
            text.exit().remove();

            simulation.alpha(0.3).restart();
        };
    }, [nodes]);

    const addVertex = () => {

    }

    const deleteVertex = () => {

    }

    const cleanAll = () => {

    }

    const showDegree = () => {

    }

    const showDegreeIndex = () => {

    }

    const setColors = () => {

    }

    const canvasStyles = cn(
        'graph-canvas',
        'bg-light'
    )

    return <svg className={canvasStyles} ref={svgRef} viewBox={viewBox}></svg>;
};

export default GraphCanvas;
