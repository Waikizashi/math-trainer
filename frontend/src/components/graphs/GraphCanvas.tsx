import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3'

interface Node extends d3.SimulationNodeDatum {
    id: number | string,
    group?: number
    degree?: number
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | number | Node;
    target: string | number | Node;
}

const GraphCanvas = () => {

    const svgRef = useRef(null);
    useEffect(() => {
        const nodes: Node[] = [
            { id: 0, group: 1 },
            { id: 1, group: 2 },
            { id: 2, group: 3 },
            { id: 3, group: 4 },
            { id: 4, group: 5 },
            { id: 5, group: 6 },
            { id: 6, group: 7 },
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
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(300, 300))
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

        svg.on('click', function (event) {
            const coords = d3.pointer(event, this); // Получаем координаты клика относительно SVG

            // Создаем новый узел в месте клика
            const newNode: Node = { id: nodes.length, x: coords[0], y: coords[1] };
            nodes.push(newNode); // Добавляем новый узел в массив узлов

            // Перезапускаем симуляцию с новыми узлами
            simulation.nodes(nodes);
            simulation.force('link').links(links);
            simulation.alpha(1).restart();

            updateGraph(); // Функция для обновления графа
        });
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

        function updateGraph() {
            // Обновляем узлы
            const nodeSelection = svg.selectAll('circle')
                .data(nodes, (d: any) => d.id);

            nodeSelection.enter()
                .append('circle')
                .attr('r', 10)
                // другие атрибуты для узлов...
                .merge(nodeSelection)
                .attr('cx', (d: any) => d.x)
                .attr('cy', (d: any) => d.y);

            nodeSelection.exit().remove();

            // Обновляем связи
            const linkSelection = svg.selectAll('line')
                .data(links);

            linkSelection.enter()
                .append('line')
                // другие атрибуты для связей...
                .merge(linkSelection)
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);

            linkSelection.exit().remove();

            // Перезапускаем симуляцию, если это необходимо
            simulation.nodes(nodes).alpha(1).restart();
        }
    }, []);

    return <svg ref={svgRef}></svg>;
};

export default GraphCanvas;
