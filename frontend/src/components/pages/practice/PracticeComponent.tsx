import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { Practice } from '../../../service/PracticeService';
import { GraphDataProps } from '../../graphs/GraphCanvas';
import { checkVerticesCount, checkEdgesCount, isAcyclic, isGraphConnected, isComplete, isTree, isEulerian, isHamiltonian } from '../../../utils/graph-analyze-utils';

interface PracticeComponentProps {
    practice: Practice | null;
    graphData: GraphDataProps | undefined;
}

const PracticeComponent: React.FC<PracticeComponentProps> = ({ practice, graphData }) => {
    const [currentContentIndex, setCurrentContentIndex] = useState<number | null>(null);
    const [contentStatus, setContentStatus] = useState<{ [key: number]: { vertices: boolean, edges: boolean, properties: boolean } }>({});

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

    const checkGraphProperties = (properties: string[]): boolean => {
        if (!graphData) return false;

        return properties.every(property => {
            switch (property) {
                case 'ACYCLIC':
                    return isAcyclic(graphData);
                case 'CONNECTED':
                    return isGraphConnected(graphData);
                case 'COMPLETE':
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
        console.log('Save button clicked');
        // Здесь можно добавить логику сохранения данных
    };

    const handleContentClick = (index: number) => {
        setCurrentContentIndex(index);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="text-center mt-4">{practice?.title}</h1>
                    {practice?.practiceContents.map((content, index) => {
                        const status = contentStatus[index];
                        const verticesValid = status ? status.vertices : false;
                        const edgesValid = status ? status.edges : false;
                        const propertiesValid = status ? status.properties : false;

                        const verticesClass = status ? (verticesValid ? 'bg-success-subtle' : 'bg-danger-subtle') : '';
                        const edgesClass = status ? (edgesValid ? 'bg-success-subtle' : 'bg-danger-subtle') : '';
                        const propertiesClass = status ? (propertiesValid ? 'bg-success-subtle' : 'bg-danger-subtle') : '';

                        return (
                            <Card
                                key={index}
                                className={`mb-3 ${index === currentContentIndex ? 'bg-body-secondary' : ''}`}
                                onClick={() => handleContentClick(index)}
                            >
                                <Card.Body>
                                    <Card.Title>{content.title}</Card.Title>
                                    {content.contentType === 'Exercise' && <Card.Text>{content.data}</Card.Text>}
                                    <ListGroup variant="flush">
                                        <ListGroup.Item><strong>Media Link:</strong> {content.mediaLink}</ListGroup.Item>
                                        <ListGroup.Item className={verticesClass}><strong>Possible Vertices:</strong> {content.possibleVertices.join(', ')}</ListGroup.Item>
                                        <ListGroup.Item className={edgesClass}><strong>Possible Edges:</strong> {content.possibleEdges.join(', ')}</ListGroup.Item>
                                        <ListGroup.Item className={propertiesClass}><strong>Graph Properties:</strong> {content.graphProperties.join(', ')}</ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        );
                    })}
                    {/* {currentContentIndex !== null && ( */}
                    <Button variant="primary" onClick={handleSaveClick}>Finish exercise</Button>
                    {/* )} */}
                </Col>
            </Row>
        </Container>
    );
};

export default PracticeComponent;
