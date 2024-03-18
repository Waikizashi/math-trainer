import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3'

interface Node extends d3.SimulationNodeDatum {
    id: number | string,
    degree?: number
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | number | Node;
    target: string | number | Node;
}

const GraphCanvas = () => {

    const addVertex = () =>{

    }

    const deleteVertex = () =>{

    }

    const cleanAll = () =>{

    }

    const showDegree = () =>{

    }

    const showDegreeIndex = () =>{

    }

    const setColors = () =>{

    }

    const svgRef = useRef(null);

    useEffect(() => {
        const nodes: Node[] = [
            { id: 0 },
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
            { id: 6 },
        ];

        const links: Link[] = [
            { source: 0, target: 1 },
            { source: 1, target: 2 },
            { source: 2, target: 3 },
            { source: 3, target: 4 },
            { source: 4, target: 0 },
        ];

        const svg = d3.select(svgRef.current)
            .attr('width', '100%')
            .attr('height', '100%');

        const linkElements = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .style('stroke', '#aaa');

        const nodeElements = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', 10)
            .style('fill', 'steelblue');

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
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(150, 150))
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
    }, []);

    return <svg ref={svgRef}></svg>;
};

export default GraphCanvas;
