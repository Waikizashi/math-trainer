import { GraphDataProps } from "../components/graphs/GraphCanvas";

export const graphs: GraphDataProps[] = [
    {
        nodes: [
            { id: "0", group: 1 },
            { id: "1", group: 1 },
            { id: "2", group: 1 },
            { id: "3", group: 1 },
            { id: "4", group: 1 }
        ],
        links: [
            { source: "0", target: "1", },
            { source: "1", target: "2", },
            { source: "2", target: "3", },
            { source: "3", target: "4", },
            { source: "4", target: "0", }
        ]
    },
    {
        nodes: [
            { id: "0", group: 1 },
            { id: "1", group: 1 },
            { id: "2", group: 1 },
            { id: "3", group: 1 },
            { id: "4", group: 1 }
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
        nodes: [
            { id: "0", group: 1 },
            { id: "1", group: 1 },
            { id: "2", group: 1 },
            { id: "3", group: 1 },
            { id: "4", group: 1 }
        ],
        links: [
            { source: "0", target: "1", },
            { source: "1", target: "2", },
            { source: "2", target: "3", },
            { source: "3", target: "4", }
        ]
    },
    {
        nodes: [
            { id: "0", group: 1 },
            { id: "1", group: 1 },
            { id: "2", group: 1 },
            { id: "3", group: 1 },
            { id: "4", group: 1 }
        ],
        links: [
            { source: "0", target: "1", },
            { source: "0", target: "2", },
            { source: "0", target: "3", },
            { source: "0", target: "4", }
        ]
    },
]