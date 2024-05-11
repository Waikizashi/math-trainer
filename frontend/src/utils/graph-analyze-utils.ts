import { GraphDataProps } from "../components/graphs/GraphCanvas";

export function isGraphConnected(graph: GraphDataProps): boolean {
    const nodeCount = graph.nodes.length;
    if (nodeCount === 0) return true; // Пустой граф считаем связанным

    // Создаем карту смежности
    const adjacencyList: Map<string, string[]> = new Map();
    graph.nodes.forEach(node => {

        adjacencyList.set(node.id, [])

    });
    graph.links.forEach((link: any) => {
        console.log('LINK: ', link.source.id)
        adjacencyList.get(link.source.id)?.push(link.target.id);
        adjacencyList.get(link.target.id)?.push(link.source.id); // Для неориентированного графа
        console.log('adjacencyList: ', adjacencyList)
    });

    // console.log('###: ', graph)
    const dfs = (node: string, visited: Set<string>) => {
        visited.add(node);

        adjacencyList.get(node)?.forEach(neighbor => {
            // console.log('SUSED: ', node)
            if (!visited.has(neighbor)) {
                dfs(neighbor, visited);
            }
        });
    };

    const visited = new Set<string>();
    dfs(graph.nodes[0].id, visited);

    return visited.size === nodeCount;
}

export function findChromaticNumber(graph: GraphDataProps): number {
    const adjacencyList: Map<string, Set<string>> = new Map();
    graph.nodes.forEach(node => adjacencyList.set(node.id, new Set()));
    graph.links.forEach((link: any) => {
        adjacencyList.get(link.source)?.add(link.target);
        adjacencyList.get(link.target)?.add(link.source); // Для неориентированного графа
    });

    const nodeColors: Map<string, number> = new Map();
    const availableColors: Set<number> = new Set();

    // Сортировка вершин по убыванию степени (жадный выбор)
    const sortedNodes = [...graph.nodes].sort((a, b) => {
        return (adjacencyList.get(b.id)?.size || 0) - (adjacencyList.get(a.id)?.size || 0);
    });

    sortedNodes.forEach(node => {
        let assignedColor = 1;
        const usedColors = new Set<number>();

        // Собираем цвета смежных вершин
        adjacencyList.get(node.id)?.forEach(neighbor => {
            if (nodeColors.has(neighbor)) {
                usedColors.add(nodeColors.get(neighbor)!);
            }
        });

        // Находим минимальный свободный цвет
        while (usedColors.has(assignedColor)) {
            assignedColor++;
        }

        // Назначаем цвет вершине
        nodeColors.set(node.id, assignedColor);
        availableColors.add(assignedColor);
    });

    // Хроматическое число это размер множества использованных цветов
    return availableColors.size;
}

export function isAcyclic(graph: GraphDataProps): boolean {
    const adjacencyList: Map<string, string[]> = new Map();
    graph.nodes.forEach(node => adjacencyList.set(node.id, []));
    graph.links.forEach((link: any) => {
        adjacencyList.get(link.source)?.push(link.target);
    });

    let isCycle = false; // Флаг для обнаружения цикла
    const visited = new Set<string>(); // Множество посещенных вершин
    const recStack = new Set<string>(); // Стек рекурсии для обнаружения циклов

    // Вспомогательная функция для выполнения DFS
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

    // Запускаем DFS из каждой непосещенной вершины
    for (let node of graph.nodes) {
        if (!visited.has(node.id)) {
            dfs(node.id);
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
            const distance = adjacencyMatrix.get(i.id)?.get(j.id) ?? Infinity;
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
            const distance = adjacencyMatrix.get(i.id)?.get(j.id) ?? Infinity;
            maxDistance = Math.max(maxDistance, distance);
        });
        radius = Math.min(radius, maxDistance);
    });

    return radius;
}


function initializeAdjacencyMatrix(graph: GraphDataProps): Map<string, Map<string, number>> {
    const adjacencyMatrix: Map<string, Map<string, number>> = new Map();
    graph.nodes.forEach(node => {
        adjacencyMatrix.set(node.id, new Map(graph.nodes.map(n => [n.id, n.id === node.id ? 0 : Infinity])));
    });

    graph.links.forEach((link: any) => {
        adjacencyMatrix.get(link.source.id)?.set(link.target.id, 1);
        adjacencyMatrix.get(link.target.id)?.set(link.source.id, 1); // Для неориентированного графа
    });

    return adjacencyMatrix;
}

function computeAllPairsShortestPaths(graph: GraphDataProps, adjacencyMatrix: Map<string, Map<string, number>>) {
    graph.nodes.forEach(k => {
        graph.nodes.forEach(i => {
            graph.nodes.forEach(j => {
                const ik = adjacencyMatrix.get(i.id)?.get(k.id) ?? Infinity;
                const kj = adjacencyMatrix.get(k.id)?.get(j.id) ?? Infinity;
                const ij = adjacencyMatrix.get(i.id)?.get(j.id) ?? Infinity;
                if (ij > ik + kj) {
                    adjacencyMatrix.get(i.id)?.set(j.id, ik + kj);
                }
            });
        });
    });
}


