import { GraphDataProps } from "../components/graphs/GraphCanvas";

export function isBipartite(graph: GraphDataProps): boolean {
    const color: Map<string, number> = new Map();

    const bfs = (start: string): boolean => {
        const queue: string[] = [start];
        color.set(start, 0);

        while (queue.length > 0) {
            const node = queue.shift()!;
            const nodeColor = color.get(node)!;

            const neighbors = graph.links
                .filter(link => link.source.nodeId === node || link.target.nodeId === node)
                .map(link => link.source.nodeId === node ? link.target.nodeId : link.source.nodeId);

            for (const neighbor of neighbors) {
                if (!color.has(neighbor)) {
                    color.set(neighbor, 1 - nodeColor);
                    queue.push(neighbor);
                } else if (color.get(neighbor) === nodeColor) {
                    return false;
                }
            }
        }
        return true;
    };

    for (const node of graph.nodes) {
        if (!color.has(node.nodeId)) {
            if (!bfs(node.nodeId)) {
                return false;
            }
        }
    }

    return true;
}

export function isTree(graph: GraphDataProps): boolean {
    return isGraphConnected(graph) && isAcyclic(graph);
}

export function isComplete(graph: GraphDataProps): boolean {
    const nodeCount = graph.nodes.length;
    const expectedEdges = (nodeCount * (nodeCount - 1)) / 2;
    return graph.links.length === expectedEdges;
}

export function findBridges(graph: GraphDataProps): { from: string, to: string }[] {
    const adjacencyList: Map<string, string[]> = new Map();
    graph.nodes.forEach(node => adjacencyList.set(node.nodeId, []));
    graph.links.forEach(link => {
        adjacencyList.get(link.source.nodeId)?.push(link.target.nodeId);
        adjacencyList.get(link.target.nodeId)?.push(link.source.nodeId);
    });

    const bridges: { from: string, to: string }[] = [];
    const visited: Map<string, number> = new Map();
    const disc: Map<string, number> = new Map();
    const low: Map<string, number> = new Map();
    let time = 0;

    const dfs = (u: string, parent: string | null) => {
        visited.set(u, time);
        disc.set(u, time);
        low.set(u, time);
        time++;

        const neighbors = adjacencyList.get(u) || [];
        for (const v of neighbors) {
            if (!visited.has(v)) {
                dfs(v, u);
                low.set(u, Math.min(low.get(u)!, low.get(v)!));

                if (low.get(v)! > disc.get(u)!) {
                    bridges.push({ from: u, to: v });
                }
            } else if (v !== parent) {
                low.set(u, Math.min(low.get(u)!, disc.get(v)!));
            }
        }
    };

    graph.nodes.forEach(node => {
        if (!visited.has(node.nodeId)) {
            dfs(node.nodeId, null);
        }
    });

    return bridges;
}


export function isEulerian(graph: GraphDataProps): boolean {
    if (!isGraphConnected(graph)) return false;

    const oddDegreeCount = graph.nodes.reduce((count, node) => {
        const degree = graph.links.filter(link => link.source.nodeId === node.nodeId || link.target.nodeId === node.nodeId).length;
        return count + (degree % 2 !== 0 ? 1 : 0);
    }, 0);

    return oddDegreeCount === 0;
}

export function isHamiltonian(graph: GraphDataProps): boolean {
    const path: string[] = [];
    const visited: Set<string> = new Set();

    const hamiltonianDFS = (node: string): boolean => {
        path.push(node);
        visited.add(node);

        if (path.length === graph.nodes.length) return true;

        const neighbors = graph.links
            .filter(link => link.source.nodeId === node || link.target.nodeId === node)
            .map(link => link.source.nodeId === node ? link.target.nodeId : link.source.nodeId);

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                if (hamiltonianDFS(neighbor)) return true;
            }
        }

        path.pop();
        visited.delete(node);
        return false;
    };

    for (const node of graph.nodes) {
        if (hamiltonianDFS(node.nodeId)) return true;
    }

    return false;
}

export function isGraphConnected(graph: GraphDataProps): boolean {
    const nodeCount = graph.nodes.length;
    if (nodeCount === 0) return true;

    const adjacencyList: Map<string, string[]> = new Map();
    graph.nodes.forEach(node => {
        adjacencyList.set(node.nodeId, [])
    });
    graph.links.forEach((link: any) => {
        adjacencyList.get(link.source.nodeId)?.push(link.target.nodeId);
        adjacencyList.get(link.target.nodeId)?.push(link.source.nodeId);
    });

    const dfs = (node: string, visited: Set<string>) => {
        visited.add(node);

        adjacencyList.get(node)?.forEach(neighbor => {
            if (!visited.has(neighbor)) {
                dfs(neighbor, visited);
            }
        });
    };

    const visited = new Set<string>();
    dfs(graph.nodes[0].nodeId, visited);

    return visited.size === nodeCount;
}

export function findChromaticNumber(graph: GraphDataProps): number {
    const adjacencyList: Map<string, Set<string>> = new Map();
    graph.nodes.forEach(node => adjacencyList.set(node.nodeId, new Set()));
    graph.links.forEach((link: any) => {
        adjacencyList.get(link.source.nodeId)?.add(link.target.nodeId);
        adjacencyList.get(link.target.nodeId)?.add(link.source.nodeId);
    });

    const nodeColors: Map<string, number> = new Map();
    let maxColor = 0;

    const sortedNodes = [...graph.nodes].sort((a, b) => {
        return (adjacencyList.get(b.nodeId)?.size || 0) - (adjacencyList.get(a.nodeId)?.size || 0);
    });

    sortedNodes.forEach(node => {
        const usedColors = new Set<number>();

        adjacencyList.get(node.nodeId)?.forEach(neighbor => {
            if (nodeColors.has(neighbor)) {
                usedColors.add(nodeColors.get(neighbor)!);
            }
        });

        let assignedColor = 1;
        while (usedColors.has(assignedColor)) {
            assignedColor++;
        }

        nodeColors.set(node.nodeId, assignedColor);
        if (assignedColor > maxColor) {
            maxColor = assignedColor;
        }
    });

    return maxColor;
}


export function isAcyclic(graph: GraphDataProps): boolean {
    const adjacencyList: Map<string, string[]> = new Map();
    graph.nodes.forEach(node => adjacencyList.set(node.nodeId, []));
    graph.links.forEach((link: any) => {
        adjacencyList.get(link.source.nodeId)?.push(link.target.nodeId);
    });

    let isCycle = false;
    const visited = new Set<string>();
    const recStack = new Set<string>();

    function dfs(vertex: string): void {
        if (recStack.has(vertex)) {
            isCycle = true;
            return;
        }
        if (visited.has(vertex)) {
            return;
        }

        visited.add(vertex);
        recStack.add(vertex);
        const neighbors = adjacencyList.get(vertex) || [];
        neighbors.forEach(neighbor => {
            if (!isCycle) {
                dfs(neighbor);
            }
        });
        recStack.delete(vertex);
    }


    for (let node of graph.nodes) {
        if (!visited.has(node.nodeId)) {
            dfs(node.nodeId);
            if (isCycle) break;
        }
    }

    return !isCycle;
}

export function findGraphDiameter(graph: GraphDataProps): number {
    const adjacencyMatrix = initializeAdjacencyMatrix(graph);
    computeAllPairsShortestPaths(graph, adjacencyMatrix);

    let diameter = 0;
    graph.nodes.forEach(i => {
        graph.nodes.forEach(j => {
            const distance = adjacencyMatrix.get(i.nodeId)?.get(j.nodeId) ?? Infinity;
            if (distance !== Infinity) {
                diameter = Math.max(diameter, distance);
            }
        });
    });

    return diameter;
}

export function findGraphRadius(graph: GraphDataProps): number {
    const adjacencyMatrix = initializeAdjacencyMatrix(graph);
    computeAllPairsShortestPaths(graph, adjacencyMatrix);

    let radius = Infinity;
    graph.nodes.forEach(i => {
        let maxDistance = 0;
        graph.nodes.forEach(j => {
            const distance = adjacencyMatrix.get(i.nodeId)?.get(j.nodeId) ?? Infinity;
            maxDistance = Math.max(maxDistance, distance);
        });
        radius = Math.min(radius, maxDistance);
    });

    return radius;
}


function initializeAdjacencyMatrix(graph: GraphDataProps): Map<string, Map<string, number>> {
    const adjacencyMatrix: Map<string, Map<string, number>> = new Map();
    graph.nodes.forEach(node => {
        adjacencyMatrix.set(node.nodeId, new Map(graph.nodes.map(n => [n.nodeId, n.nodeId === node.nodeId ? 0 : Infinity])));
    });

    graph.links.forEach((link: any) => {
        adjacencyMatrix.get(link.source.nodeId)?.set(link.target.nodeId, 1);
        adjacencyMatrix.get(link.target.nodeId)?.set(link.source.nodeId, 1);
    });

    return adjacencyMatrix;
}

function computeAllPairsShortestPaths(graph: GraphDataProps, adjacencyMatrix: Map<string, Map<string, number>>) {
    graph.nodes.forEach(k => {
        graph.nodes.forEach(i => {
            graph.nodes.forEach(j => {
                const ik = adjacencyMatrix.get(i.nodeId)?.get(k.nodeId) ?? Infinity;
                const kj = adjacencyMatrix.get(k.nodeId)?.get(j.nodeId) ?? Infinity;
                const ij = adjacencyMatrix.get(i.nodeId)?.get(j.nodeId) ?? Infinity;
                if (ij > ik + kj) {
                    adjacencyMatrix.get(i.nodeId)?.set(j.nodeId, ik + kj);
                }
            });
        });
    });
}

export function checkVerticesCount(graph: GraphDataProps, possibleCounts: number[]): boolean {
    return possibleCounts.includes(graph.nodes.length);
}

export function checkEdgesCount(graph: GraphDataProps, possibleCounts: number[]): boolean {
    return possibleCounts.includes(graph.links.length);
}

