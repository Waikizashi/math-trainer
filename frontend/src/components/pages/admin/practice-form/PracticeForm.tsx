import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

export interface PracticeContent {
  contentType: string;
  title: string;
  data: string;
  mediaLink: string;
  possibleVertices: number[];
  possibleEdges: number[];
  graphProperties: string[];
}

interface PracticeFormProps {
  onSubmit: (practiceContent: PracticeContent) => void;
}

const PracticeForm: React.FC<PracticeFormProps> = ({ onSubmit }) => {
  const [practiceContent, setPracticeContent] = useState<PracticeContent>({
    contentType: 'Exercise',
    title: '',
    data: '',
    mediaLink: '',
    possibleVertices: [],
    possibleEdges: [],
    graphProperties: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPracticeContent({ ...practiceContent, [name]: value });
  };

  const handleArrayChange = (name: keyof PracticeContent, value: string) => {
    setPracticeContent({ ...practiceContent, [name]: value.split(',').map(item => item.trim()) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(practiceContent);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={practiceContent.title}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formContentType">
        <Form.Label>Content Type</Form.Label>
        <Form.Control
          as="select"
          name="contentType"
          value={practiceContent.contentType}
          onChange={handleChange}
          required
        >
          <option value="Exercise">Exercise</option>
          <option value="Quiz">Quiz</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formData">
        <Form.Label>Data</Form.Label>
        <Form.Control
          as="textarea"
          name="data"
          value={practiceContent.data}
          onChange={handleChange}
          rows={3}
          required
        />
      </Form.Group>

      <Form.Group controlId="formMediaLink">
        <Form.Label>Media Link</Form.Label>
        <Form.Control
          type="url"
          name="mediaLink"
          value={practiceContent.mediaLink}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formPossibleVertices">
        <Form.Label>Possible Vertices</Form.Label>
        <Form.Control
          type="text"
          name="possibleVertices"
          value={practiceContent.possibleVertices.join(', ')}
          onChange={(e) => handleArrayChange('possibleVertices', e.target.value)}
        />
        <Form.Text className="text-muted">
          Enter numbers separated by commas.
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="formPossibleEdges">
        <Form.Label>Possible Edges</Form.Label>
        <Form.Control
          type="text"
          name="possibleEdges"
          value={practiceContent.possibleEdges.join(', ')}
          onChange={(e) => handleArrayChange('possibleEdges', e.target.value)}
        />
        <Form.Text className="text-muted">
          Enter numbers separated by commas.
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="formGraphProperties">
        <Form.Label>Graph Properties</Form.Label>
        <Form.Control
          type="text"
          name="graphProperties"
          value={practiceContent.graphProperties.join(', ')}
          onChange={(e) => handleArrayChange('graphProperties', e.target.value)}
        />
        <Form.Text className="text-muted">
          Enter properties separated by commas (e.g., CONNECTED, WEIGHTED).
        </Form.Text>
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default PracticeForm;
