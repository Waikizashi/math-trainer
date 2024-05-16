import { GraphDataProps } from "../components/graphs/GraphCanvas";

export const graphs: GraphDataProps[] = [
    {
        title: 'graph-1',
        nodes: [
            { nodeId: "AA", group: "1" },
            { nodeId: "BB", group: "1" },
            { nodeId: "CC", group: "1" },
            { nodeId: "DD", group: "1" },
            { nodeId: "EE", group: "1" }
        ],
        links: [
            { source: "AA", target: "BB", },
            { source: "BB", target: "CC", },
            { source: "CC", target: "DD", },
            { source: "DD", target: "EE", },
            { source: "EE", target: "AA", }
        ]
    },
    {
        title: 'graph-2',
        nodes: [
            { nodeId: "0", group: "1" },
            { nodeId: "1", group: "1" },
            { nodeId: "2", group: "1" },
            { nodeId: "3", group: "1" },
            { nodeId: "4", group: "1" }
        ],
        links: [
            { source: "0", target: "1", },
            { source: "0", target: "2", },
            { source: "0", target: "3", },
            { source: "0", target: "4", },
            { source: "1", target: "2", },
            { source: "1", target: "3", },
            { source: "1", target: "4", },
            { source: "2", target: "3", },
            { source: "2", target: "4", },
            { source: "3", target: "4", }
        ]
    },
    {
        title: 'graph-3',
        nodes: [
            { nodeId: "0", group: "1" },
            { nodeId: "1", group: "1" },
            { nodeId: "2", group: "1" },
            { nodeId: "3", group: "1" },
            { nodeId: "4", group: "1" }
        ],
        links: [
            { source: "0", target: "1", },
            { source: "1", target: "2", },
            { source: "2", target: "3", },
            { source: "3", target: "4", }
        ]
    },
    {
        title: 'graph-4',
        nodes: [
            { nodeId: "0", group: "1" },
            { nodeId: "1", group: "1" },
            { nodeId: "2", group: "1" },
            { nodeId: "3", group: "1" },
            { nodeId: "4", group: "1" }
        ],
        links: [
            { source: "0", target: "1", },
            { source: "0", target: "2", },
            { source: "0", target: "3", },
            { source: "0", target: "4", }
        ]
    },
]