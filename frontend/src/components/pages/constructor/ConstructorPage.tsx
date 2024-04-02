import React, { useEffect, useRef, useState } from 'react';
import s from './constructor.module.css';
import cn from 'classnames';
import MainMenu from '../../navigation/Menu';

import { mainContainer, subContainer } from '../../../utils/styles/global-styles';
import GraphCanvas, { GraphDataProps } from '../../graphs/GraphCanvas';

const ConstructorPage = () => {
    const parentRef = useRef(null);
    const initialMatrix = [
        ["0", "0", "0"],
        ["0", "0", "0"],
        ["0", "0", "0"],
    ];
    const [matrix, setMatrix] = useState(initialMatrix);
    const [graphTemplate, setGraphTemplate] = useState<GraphDataProps | undefined>(undefined);
    const [matrixControlState, setMatrixControlState] = useState(false);
    const increaseMatrix = () => {
        // Создаем новую строку с дополнительным элементом
        const newRow = new Array(matrix[0].length + 1).fill("0");

        // Добавляем новый элемент в каждую существующую строку
        const newMatrix = matrix.map(row => [...row, "0"]);

        // Добавляем новую строку в матрицу
        setMatrix([...newMatrix, newRow]);
    };
    const decreaseMatrix = () => {
        if (matrix.length > 1 && matrix[0].length > 1) {
            // Удаление последнего элемента из каждой строки
            const newMatrix = matrix.map(row => row.slice(0, -1));

            // Удаление последней строки
            newMatrix.pop();

            setMatrix(newMatrix);
        }
    };
    const changeMatrixControlState = (state: boolean) => {
        setMatrixControlState(state)
    }
    const handleMatrixChange = (rowIndex: number, columnIndex: number, value: number | string) => {
        // Создаем новую матрицу на основе предыдущего состояния
        const updatedMatrix = matrix.map((row, rIndex) => {
            if (rIndex === rowIndex) {
                return row.map((cell, cIndex) => {
                    if (cIndex === columnIndex) {
                        return value.toString() // Обновляем значение измененного элемента
                    }
                    return cell;
                });
            }
            return row;
        });

        setMatrix(updatedMatrix); // Обновляем состояние матрицы
    };

    const parseMatrixToObject = () => {
        const nodes = matrix.map((_, index) => ({ id: `${index}`, group: "1" }));
        const links: any = [];

        matrix.forEach((row, rowIndex) => {
            row.forEach((value, columnIndex) => {
                const weight = parseInt(value, 10);
                if (weight !== 0 && rowIndex < columnIndex) {
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
        console.log(parseMatrixToObject())
        setGraphTemplate(parseMatrixToObject())
        if (parentRef) {
        }
    }, [matrix]);

    useEffect(() => {
        if (parentRef) {
        }
    }, [matrixControlState]);

    return (
        <div className={mainContainer}>
            <MainMenu />
            <div className={subContainer}>
                <div hidden={!matrixControlState} className="card position-absolute" style={{ top: 65, left: 15, width: 'auto', zIndex: 99 }}>
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    {matrix[0] && matrix[0].map((_, cellIndex) => (
                                        <th key={cellIndex} className='pb-1 pt-0 px-1'>{cellIndex + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {matrix.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <th className='pb-1 pt-0 px-1'>{rowIndex + 1}</th>
                                        {row.map((cell, cellIndex) => (
                                            <td className='pb-1 pt-0 px-1' key={cellIndex}>
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

                        <div className="d-flex justify-content-between">
                            <button className="btn btn-primary" style={{ height: 'fit-content' }} onClick={increaseMatrix}>
                                <p className='p-0 m-0'>+</p>
                            </button>
                            <button className="btn btn-secondary" style={{ height: 'fit-content' }} onClick={decreaseMatrix}>
                                <p className='p-0 m-0'>-</p>
                            </button>
                        </div>
                    </div>
                </div>
                <GraphCanvas
                    graphData={graphTemplate}
                    canvasPreferencies={{ matrixControl: changeMatrixControlState }}></GraphCanvas>
            </div>
        </div>
    );
}

export default ConstructorPage;