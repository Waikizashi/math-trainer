export function mapGraphData(graphData) {
  const output = {
    title: graphData.title,
    oriented: graphData.oriented,
    nodes: [],
    links: []
  };

  const nodes = graphData.nodes.map(node => ({
    nodeId: node.nodeId,
    group: node.group,
    degree: 0
  }));

  const links = graphData.links.map(link => {
    const sourceNode = nodes.find(n => n.nodeId === link.source);
    const targetNode = nodes.find(n => n.nodeId === link.target);

    if (sourceNode && targetNode) {
      sourceNode.degree++;
      targetNode.degree++;
      return {
        source: sourceNode,
        target: targetNode
      };
    }
  }).filter(link => link);

  output.nodes = output.nodes.concat(nodes);
  output.links = output.links.concat(links);

  return output;
}
