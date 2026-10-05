import { API_URL } from '../../../service/service.config';
import React, { useEffect, useState } from 'react';
import { Theory } from '../../../service/TheoryService';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import MathText from '../../mathText/MathText';

interface TheoryComponentProps {
  theory?: Theory;
  user: any;
  onContentClick: (contentIndex: number) => void;
  onGraphClick: (contentIndex: number, graphIndex: number) => void;
}

const clickableContentTypes = ['Example', 'Graph'];

const TheoryComponent: React.FC<TheoryComponentProps> = ({ theory, user, onContentClick, onGraphClick }) => {
  const [currentContentFocus, setCurrentContentFocus] = useState(0);
  const [currentContentGraphFocus, setCurrentContentGraphFocus] = useState(0);

  useEffect(() => {
    const createTheoryCompletion = async () => {
      if (user && theory) {
        try {
          await axios.post(`${API_URL}/user-profile/theory-completions`, {
            theoryId: theory.id,
            theoryStatus: "IN_PROGRESS",
          });
        } catch (error) {
          console.error('Error creating theory completion:', error);
        }
      }
    };

    createTheoryCompletion();
  }, [theory, user]);

  useEffect(() => {
    const allClickableContents = theory?.theoryContents.filter(content => clickableContentTypes.includes(content.contentType)) || [];
    console.log(allClickableContents.length);
    if (
      (allClickableContents.length > 0 && allClickableContents.every((content, index) => index <= currentContentFocus)) ||
      allClickableContents.length == 0
      ) {
      const updateTheoryCompletion = async () => {
        if (user && theory) {
          try {
            await axios.put(`${API_URL}/user-profile/theory-completions`, {
              theoryId: theory.id,
              theoryStatus: "COMPLETED",
            });
          } catch (error) {
            console.error('Error updating theory completion:', error);
          }
        }
      };

      updateTheoryCompletion();
    }
  }, [currentContentFocus, theory, user]);

  const handleContentClick = (contentIndex: number) => {
    setCurrentContentFocus(contentIndex);
    setCurrentContentGraphFocus(0);
    onContentClick && onContentClick(contentIndex)
  };

  const handleGraphClick = (contentIndex: number, graphIndex: number) => {
    setCurrentContentFocus(contentIndex);
    setCurrentContentGraphFocus(graphIndex);
    onGraphClick && onGraphClick(contentIndex, graphIndex)
  };

  return (
    <Container>
      {/* <Row> */}
      {/* <Col> */}
      {/* <div className=''>
        <h2 className="text-center mt-4">{theory?.title}</h2>
      </div> */}
      {theory?.theoryContents.map((content, contentIndex) => (
        <Card
          key={contentIndex}
          className={`mb-3 ${contentIndex === currentContentFocus ? 'bg-warning-subtle' : ''} shadow`}
          onClick={() => clickableContentTypes.includes(content.contentType) && handleContentClick(contentIndex)}
        >
          <Card.Body>
            <Card.Title>{content.title}</Card.Title>
            <Card.Text>
              <MathText text={content.data} />
            </Card.Text>
            <Card.Img src={content.mediaLink} alt={content.title} />
            {content.graphData && content.graphData.length > 0 && (
              <div>
                <h5>Graph Descriptions:</h5>
                {content.graphData.map((graph, graphIndex) => (
                  <Card
                    key={graphIndex}
                    className={`mb-2 ${contentIndex === currentContentFocus && graphIndex === currentContentGraphFocus ? 'bg-secondary text-white' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGraphClick(contentIndex, graphIndex);
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
      {/* </Col> */}
      {/* </Row> */}
    </Container>
  );
};

export default TheoryComponent;
