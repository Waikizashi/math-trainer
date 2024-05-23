import React from 'react';
import { Theory } from '../../../service/TheoryService';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface TheoryComponentProps {
  theory: Theory | null;
}

const TheoryComponent: React.FC<TheoryComponentProps> = ({ theory }) => {
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-center mt-4">{theory?.title}</h1>
          {theory?.theoryContent.map((content: any, index: any) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Card.Title>{content.title}</Card.Title>
                {content.contentType === 'Article' && <Card.Text>{content.data}</Card.Text>}
                {content.contentType === 'Picture' && <Card.Img src={content.data} alt={content.title} />}
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default TheoryComponent;
