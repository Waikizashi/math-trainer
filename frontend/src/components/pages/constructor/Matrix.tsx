import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import s from './constructor.module.css';
import ms from './matrix.module.css';
import cn from 'classnames';
import { GraphDataProps } from '../../graphs/GraphCanvas';

interface MatrixProps {
    onMatrixChange: (newMatrix: any) => void; // Пример типа, где onMatrixChange - функция, принимающая матрицу строк
}

const Matrix: React.FC<MatrixProps> = ({ onMatrixChange }) => {
    const initialMatrix = [
        ["0", "0", "0"],
        ["0", "0", "0"],
        ["0", "0", "0"],
    ];
    const [matrix, setMatrix] = useState(initialMatrix);
    const increaseMatrix = () => {
        const newRow = new Array(matrix[0].length + 1).fill("0");

        const newMatrix = matrix.map(row => [...row, "0"]);

        setMatrix([...newMatrix, newRow]);
    };
    const decreaseMatrix = () => {
        if (matrix.length > 1 && matrix[0].length > 1) {
            const newMatrix = matrix.map(row => row.slice(0, -1));

            newMatrix.pop();

            setMatrix(newMatrix);
        }
    };

    const handleMatrixChange = (rowIndex: number, columnIndex: number, value: number | string) => {
        const updatedMatrix = matrix.map((row, rIndex) => {
            if (rIndex === rowIndex) {
                return row.map((cell, cIndex) => {
                    if (cIndex === columnIndex) {
                        return value.toString()
                    }
                    return cell;
                });
            }
            return row;
        });

        setMatrix(updatedMatrix);
    };

    const parseMatrixToObject = () => {
        const nodes = matrix.map((_, index) => ({ id: `${index}`, group: "1" }));
        const links: any = [];

        matrix.forEach((row, rowIndex) => {
            row.forEach((value, columnIndex) => {
                const weight = parseInt(value, 10);
                if (weight !== 0) {
                    links.push({
                        source: `${rowIndex}`,
                        target: `${columnIndex}`,
                    });
                }
            });
        });

        return { nodes, links };
    };

    useEffect(() => {
        onMatrixChange && onMatrixChange(parseMatrixToObject())
    }, [matrix]);

    const actionsStyle = cn(
        "d-flex",
        "justify-content-start",
        "border-bottom",
        "border-secondary",
        "pb-2"
    )
    const actionBtnStyle = cn(
        "mx-1",
        "p-0"
    )
    return (
        <div className={ms.matrixContainer}>
            <div className={actionsStyle}>
                <button type="button" className={cn("btn btn-primary", actionBtnStyle)} style={{ height: 'fit-content' }} onClick={increaseMatrix}>
                    <AddIcon></AddIcon>
                </button>
                <button type='button' className={cn("btn btn-secondary", actionBtnStyle)} style={{ height: 'fit-content' }} onClick={decreaseMatrix}>
                    <RemoveIcon></RemoveIcon>
                </button>
            </div>
            <table className="table">
                <thead>
                    <tr className={cn(s.borderOff)}>
                        <th></th>
                        {matrix[0] && matrix[0].map((_, cellIndex) => (
                            <th key={cellIndex} className={cn('pb-1 pt-0 px-1', s.colHead)}>{cellIndex}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {matrix.map((row, rowIndex) => (
                        <tr className={cn(s.borderOff)} key={rowIndex}>
                            <th className={cn('pb-1 pt-1 px-1', s.rowHead)}>{rowIndex}</th>
                            {row.map((cell, cellIndex) => (
                                <td className='pb-0 pt-1 px-1' key={cellIndex}>
                                    <input
                                        type="text"
                                        className={s.matrixCell}
                                        onChange={(e) => handleMatrixChange(rowIndex, cellIndex, e.target.value)}
                                        value={cell}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default Matrix