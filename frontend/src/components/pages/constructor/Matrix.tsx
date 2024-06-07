import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import s from './constructor.module.css';
import ms from './matrix.module.css';
import cn from 'classnames';
import { GraphDataProps, Node, Link } from '../../canvas/GraphCanvas';
import { useCenter } from '../../../context/CenterContext';

interface MatrixProps {
    onMatrixChange: (newMatrix: GraphDataProps) => void;
    graphData?: GraphDataProps;
}

const Matrix: React.FC<MatrixProps> = ({ onMatrixChange, graphData }) => {
    const initialMatrix = [
        ["0", "0", "0"],
        ["0", "0", "0"],
        ["0", "0", "0"],
    ];
    const [matrix, setMatrix] = useState(initialMatrix);
    const [toUpd, setToUpd] = useState(false);
    const [nodeIdMap, setNodeIdMap] = useState<string[]>([]);
    const { centerX, centerY } = useCenter();
    const [activeCell, setActiveCell] = useState<{ row: number, col: number } | null>(null);

    const parseGraphToMatrix = (graph: GraphDataProps) => {
        const nodeIds = graph.nodes.map(node => node.nodeId);
        setNodeIdMap(nodeIds);

        const size = nodeIds.length;
        const newMatrix = Array.from({ length: size }, () => Array(size).fill("0"));

        graph.links.forEach(link => {
            const sourceIndex = nodeIds.indexOf(link.source.nodeId);
            const targetIndex = nodeIds.indexOf(link.target.nodeId);
            newMatrix[sourceIndex][targetIndex] = "1";
        });

        return newMatrix;
    };

    useEffect(() => {
        if (graphData) {
            setMatrix(parseGraphToMatrix(graphData));
        }
    }, [graphData]);
    useEffect(() => {
    }, [activeCell]);

    const increaseMatrix = () => {
        const newRow = matrix[0] ? new Array(matrix[0].length + 1).fill("0") : new Array(1).fill("0");
        const newMatrix = matrix.map(row => [...row, "0"]);
        setMatrix([...newMatrix, newRow]);

        const newIndex = (matrix.length).toString();
        setNodeIdMap([...nodeIdMap, newIndex]);
        setToUpd(true);
    };

    const decreaseMatrix = () => {
        if (matrix.length > 1 && matrix[0].length > 1) {
            const newMatrix = matrix.map(row => row.slice(0, -1));
            newMatrix.pop();
            setMatrix(newMatrix);

            const newNodeIdMap = nodeIdMap.slice(0, -1);
            setNodeIdMap(newNodeIdMap);
            setToUpd(true);
        }
    };

    const handleMatrixChange = (rowIndex: number, columnIndex: number, value: number | string) => {
        const updatedMatrix = matrix.map((row, rIndex) => {
            if (rIndex === rowIndex) {
                return row.map((cell, cIndex) => {
                    if (cIndex === columnIndex) {
                        return value.toString();
                    }
                    return cell;
                });
            }
            return row;
        });

        setMatrix(updatedMatrix);
        setToUpd(true);
    };

    const parseMatrixToObject = () => {
        const nodes = nodeIdMap.map((nodeId, index) => {
            const existingNode = graphData?.nodes.find(node => node.nodeId === nodeId);
            return existingNode ? existingNode : { nodeId, group: "1", x: centerX, y: centerY };
        });
        const links: Link[] = [];

        matrix.forEach((row, rowIndex) => {
            row.forEach((value, columnIndex) => {
                const weight = parseInt(value, 10);
                if (weight !== 0) {
                    const existingLink = graphData?.links.find(link => link.source.nodeId === nodeIdMap[rowIndex] && link.target.nodeId === nodeIdMap[columnIndex]);
                    if (existingLink) {
                        links.push(existingLink);
                    } else {
                        links.push({
                            source: nodes[rowIndex],
                            target: nodes[columnIndex],
                        });
                    }
                }
            });
        });

        const updatedNodes = nodes.filter(node => matrix[nodeIdMap.indexOf(node.nodeId)] !== undefined);
        const updatedLinks = links.filter(link => nodeIdMap.includes(link.source.nodeId) && nodeIdMap.includes(link.target.nodeId));

        return { ...graphData, nodes: updatedNodes, links: updatedLinks };
    };

    useEffect(() => {
        if (toUpd) {
            onMatrixChange && onMatrixChange(parseMatrixToObject());
            setToUpd(false);
        }
    }, [matrix]);

    const actionsStyle = cn(
        "d-flex",
        "justify-content-start",
        "border-bottom",
        "border-secondary",
        "pb-2"
    );
    const actionBtnStyle = cn(
        "mx-1",
        "p-0"
    );

    const isActiveRow = (rowIndex: number) => activeCell?.row === rowIndex;
    const isActiveCol = (colIndex: number) => activeCell?.col === colIndex;
    return (
        <div className={ms.matrixContainer}>
            <div className={actionsStyle}>
                <button type="button" className={cn("btn btn-primary", actionBtnStyle)} style={{ height: 'fit-content' }} onClick={increaseMatrix}>
                    <AddIcon />
                </button>
                <button type="button" className={cn("btn btn-secondary", actionBtnStyle)} style={{ height: 'fit-content' }} onClick={decreaseMatrix}>
                    <RemoveIcon />
                </button>
            </div>
            <div className='overflow' style={{ maxHeight: '45vh', maxWidth: '45vh' }}>
                <table className="table m-0">
                    <thead>
                        <tr className={cn(s.borderOff)}>
                            <th></th>
                            {matrix[0] && matrix[0].map((_, cellIndex) => (
                                <th key={cellIndex} className={cn('pb-1 pt-0 px-1', s.colHead)}>{nodeIdMap[cellIndex]}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, rowIndex) => (
                            <tr className={cn(s.borderOff)} key={rowIndex}>
                                <th className={cn('pb-1 pt-1 px-1', s.rowHead)}>{nodeIdMap[rowIndex]}</th>
                                {row.map((cell, cellIndex) => (
                                    <td className={cn('pb-0 pt-1 px-1',
                                        isActiveCol(cellIndex) || isActiveRow(rowIndex) ?
                                            'bg-primary bg-opacity-25'
                                            : ''
                                    )} key={cellIndex}>
                                        <input
                                            type="text"
                                            className={s.matrixCell}
                                            onChange={(e) => handleMatrixChange(rowIndex, cellIndex, e.target.value)}
                                            value={cell}
                                            min={0}
                                            max={1}
                                            onFocus={() => {
                                                setActiveCell({ row: rowIndex, col: cellIndex })
                                                console.log(rowIndex, cellIndex)
                                            }}
                                            onBlur={() => setActiveCell(null)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Matrix;
