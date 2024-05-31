import React from 'react';
import { Theory } from '../../../service/TheoryService';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface TheoryComponentProps {
  theory: Theory | null;
  onContentClick: (contentIndex: number) => void;
  onGraphClick: (contentIndex: number, graphIndex: number) => void;
  currentContentFocus: number;
  currentContentGraphFocus: number;
}

const clickableContentTypes = ['Article', 'Graph']; // Список типов контента, который должен быть кликабельным

const TheoryComponent: React.FC<TheoryComponentProps> = ({ theory, onContentClick, onGraphClick, currentContentFocus, currentContentGraphFocus }) => {
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-center mt-4">{theory?.title}</h1>
          {theory?.theoryContents.map((content, contentIndex) => (
            <Card
              key={contentIndex}
              className={`mb-3 ${contentIndex === currentContentFocus ? 'bg-light' : ''}`}
              onClick={() => clickableContentTypes.includes(content.contentType) && onContentClick(contentIndex)}
            >
              <Card.Body>
                <Card.Title>{content.title}</Card.Title>
                {content.contentType === 'Article' && <Card.Text>{content.data}</Card.Text>}
                {content.contentType === 'Picture' && <Card.Img src={content.data} alt={content.title} />}
                {content.graphData && content.graphData.length > 0 && (
                  <div>
                    <h5>Graph Descriptions:</h5>
                    {content.graphData.map((graph, graphIndex) => (
                      <Card
                        key={graphIndex}
                        className={`mb-2 ${contentIndex === currentContentFocus && graphIndex === currentContentGraphFocus ? 'bg-secondary text-white' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onGraphClick(contentIndex, graphIndex);
                        }}
                      >
                        <Card.Body>
                          <Card.Title>{graph.title}</Card.Title>
                          <Card.Text>{`Oriented: ${graph.oriented ? 'Yes' : 'No'}`}</Card.Text>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default TheoryComponent;
