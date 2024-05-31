import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import data from '../../data/data.json'; // Подключение вашего JSON файла

const FloatingGraphs = ({ backgroundImage, backgroundColor }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d, radius: 5 }));

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody()
        .strength(-height / 16)
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1));

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0)
      .style('pointer-events', 'none');

    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => color(d.group))
      .on('mouseover', function (event, d) {
        simulation.alphaTarget(0.3).restart();
        d3.select(this).transition()
          .duration(150)
          .attr('r', 7);

        d.fx = d.x + (Math.random() - 0.5) * 100;
        d.fy = d.y + (Math.random() - 0.5) * 100;
      })
      .on('mouseout', function (event, d) {
        d3.select(this).transition()
          .duration(150)
          .attr('r', 5);

        d.fx = null;
        d.fy = null;
        simulation.alphaTarget(0);
      });

    node.append('title')
      .text(d => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });

    // Добавим вращение по часовой стрелке вокруг центра
    d3.timer((elapsed) => {
      const angle = (elapsed / 1000); // медленное вращение по часовой стрелке
      svg.attr('transform', `rotate(${angle}, ${0}, ${0})`);
    });

    return () => {
      svg.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundColor: backgroundColor || 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />
  );
};

export default FloatingGraphs;
