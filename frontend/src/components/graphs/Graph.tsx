import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Graph = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        const nodes = [
            { id: 'node1' },
            { id: 'node2' },
            { id: 'node3' }
        ];

        const links = [
            { source: 'node1', target: 'node2' },
            { source: 'node2', target: 'node3' }
        ];

        const svg = d3.select(svgRef.current)
            .attr('width', 300)
            .attr('height', 300);

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

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(150, 150))
            .on('tick', () => {
                linkElements
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);

                nodeElements
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y);
            });

        return () => { simulation.stop(); };
    }, []);

    return <svg ref={svgRef}></svg>;
};

export default Graph;
