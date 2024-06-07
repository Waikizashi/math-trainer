import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { Practice } from '../../../service/PracticeService';
import { GraphDataProps } from '../../canvas/GraphCanvas';
import { checkVerticesCount, checkEdgesCount, isAcyclic, isGraphConnected, isComplete, isTree, isEulerian, isHamiltonian, findBridges } from '../../../utils/graph-analyze-utils';
import MathJax from 'react-mathjax3';
import MathRenderer from '../../MathRenderer/MathRenderer.jsx';
import cn from 'classnames';
import { useNotification } from '../../../context/NotificationContext';

interface PracticeComponentProps {
    practice?: Practice;
    graphData: GraphDataProps | undefined;
    user: any;
}

const PracticeComponent: React.FC<PracticeComponentProps> = ({ practice, graphData, user }) => {
    const [currentContentIndex, setCurrentContentIndex] = useState<number | null>(null);
    const [contentStatus, setContentStatus] = useState<{ [key: number]: { vertices: boolean, edges: boolean, properties: boolean } }>({});
    const { addNotification } = useNotification();

    useEffect(() => {
        if (user && practice) {
            createPracticeCompletion();
        }
    }, [practice, user]);

    useEffect(() => {
        if (currentContentIndex !== null && graphData) {
            const content = practice?.practiceContents[currentContentIndex];
            if (content) {
                const verticesValid = checkVerticesCount(graphData, content.possibleVertices);
                const edgesValid = checkEdgesCount(graphData, content.possibleEdges);
                const propertiesValid = checkGraphProperties(content.graphProperties);

                setContentStatus(prevStatus => ({
                    ...prevStatus,
                    [currentContentIndex]: { vertices: verticesValid, edges: edgesValid, properties: propertiesValid }
                }));
            }
        }
    }, [currentContentIndex, graphData]);

    const createPracticeCompletion = async () => {
        if (user && practice) {
            try {
                const response = await axios.post('http://localhost:8080/api/user-profile/practice-completions', {
                    completionDate: "",
                    practiceId: practice.id,
                    practiceTitle: practice.title,
                    practiceStatus: "IN_PROGRESS",
                    userId: user.id
                });
            } catch (error) {
                console.error('Error creating practice completion:', error);
            }
        }
    };

    const updatePracticeCompletion = async (status: string) => {
        if (user && practice) {
            try {
                await axios.put('http://localhost:8080/api/user-profile/practice-completions', {
                    completionDate: new Date().toISOString(),
                    practiceId: practice.id,
                    practiceTitle: practice.title,
                    practiceStatus: status,
                    userId: user.id
                });
            } catch (error) {
                console.error('Error updating practice completion:', error);
            }
        }
    };

    const checkGraphProperties = (properties: string[]): boolean => {
        if (!graphData) return false;

        return properties.every(property => {
            switch (property) {
                case 'ACYCLIC':
                    return isAcyclic(graphData);
                case 'CONNECTED':
                    return isGraphConnected(graphData);
                case 'COMPLETED':
                    return isComplete(graphData);
                case 'TREE':
                    return isTree(graphData);
                case 'EULERIAN':
                    return isEulerian(graphData);
                case 'HAMILTONIAN':
                    return isHamiltonian(graphData);
                default:
                    return false;
            }
        });
    };

    const handleSaveClick = () => {
        const allCompleted = Object.values(contentStatus).every(status => status.vertices && status.edges && status.properties);
        const status = allCompleted ? "COMPLETED" : "FAILED";
        updatePracticeCompletion(status).then(() => {
            addNotification('Zadanie bolo uložene', 'saved.', 'success')
        });
    };

    const handleContentClick = (index: number) => {
        setCurrentContentIndex(index);
    };

    return (
        <Container>
            {/* <Row>
                <Col> */}
            {/* <div className='card-header m-1 bg-info bg-opacity-25 border rounded-3'>
                <h3 className="text-center my-1 text-secondary-emphasis">{practice?.title}</h3>
            </div> */}
            {practice?.practiceContents.map((content, index) => {
                const status = contentStatus[index];
                const verticesValid = status ? status.vertices : false;
                const edgesValid = status ? status.edges : false;
                const propertiesValid = status ? status.properties : false;

                const verticesClass = status ?
                    (verticesValid ? 'bg-success bg-gradient bg-opacity-75 text-light'
                        : 'bg-danger bg-gradient bg-opacity-100 text-light')
                    : '';
                const edgesClass = status
                    ? (edgesValid
                        ? 'bg-success bg-gradient bg-opacity-75 text-light'
                        : 'bg-danger bg-gradient bg-opacity-100 text-light')
                    : '';
                const propertiesClass = status
                    ? (propertiesValid
                        ? 'bg-success bg-gradient bg-opacity-75 text-light'
                        : 'bg-danger bg-gradient bg-opacity-100 text-light')
                    : '';

                return (
                    <Card
                        key={index}
                        className={`mb-3 ${index === currentContentIndex ? 'bg-warning-subtle' : ''} shadow`}
                        onClick={() => handleContentClick(index)}
                    >
                        <Card.Body>
                            <Card.Title>{content.title}</Card.Title>
                            <Card.Text>
                                {content.data}
                            </Card.Text>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Media Link:</strong> {content.mediaLink}</ListGroup.Item>
                                <ListGroup.Item className={cn(verticesClass)}><strong>Possible Vertices:</strong> {content.possibleVertices.join(', ')}</ListGroup.Item>
                                <ListGroup.Item className={cn(edgesClass)}><strong>Possible Edges:</strong> {content.possibleEdges.join(', ')}</ListGroup.Item>
                                <ListGroup.Item className={cn(propertiesClass)}><strong>Graph Properties:</strong> {content.graphProperties.join(', ')}</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                );
            })}
            <Button variant="primary" onClick={handleSaveClick}>Finish exercise</Button>
            {/* </Col>
            </Row> */}
        </Container>
    );
};

export default PracticeComponent;
