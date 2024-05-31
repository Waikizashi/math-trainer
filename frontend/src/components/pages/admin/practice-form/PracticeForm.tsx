import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import practiceService, { Practice, PracticeContent } from '../../../../service/PracticeService';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

const graphPropertyOptions = [
  { value: 'CONNECTED', label: 'CONNECTED' },
  { value: 'WEIGHTED', label: 'WEIGHTED' },
  { value: 'ACYCLIC', label: 'ACYCLIC' },
  { value: 'DIRECTED', label: 'DIRECTED' },
];

const PracticeForm = () => {
  const { control, handleSubmit, register } = useForm<Practice>({
    defaultValues: {
      title: '',
      practiceContents: [{
        contentType: '',
        title: '',
        data: '',
        mediaLink: '',
        possibleVertices: [],
        possibleEdges: [],
        graphProperties: []
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'practiceContents'
  });

  const onSubmit = async (data: Practice) => {
    try {
      const response = await practiceService.createPractice(data);
      console.log('Practice created successfully', response);
    } catch (error) {
      console.error('Error creating practice', error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control {...register('title', { required: true })} placeholder="Enter title" />
        </Form.Group>

        {fields.map((field, index) => (
          <div key={field.id}>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId={`contentType-${index}`}>
                  <Form.Label>Content Type</Form.Label>
                  <Form.Control {...register(`practiceContents.${index}.contentType`)} placeholder="Exercise or Quiz" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId={`title-${index}`}>
                  <Form.Label>Title</Form.Label>
                  <Form.Control {...register(`practiceContents.${index}.title`)} placeholder="Enter content title" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId={`data-${index}`} className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control as="textarea" rows={3} {...register(`practiceContents.${index}.data`)} placeholder="Enter content data" />
            </Form.Group>
            <Form.Group controlId={`mediaLink-${index}`} className="mb-3">
              <Form.Label>Media Link</Form.Label>
              <Form.Control {...register(`practiceContents.${index}.mediaLink`)} placeholder="Enter media link" />
            </Form.Group>

            <Form.Group controlId={`possibleVertices-${index}`} className="mb-3">
              <Form.Label>Possible Vertices</Form.Label>
              <Controller
                control={control}
                name={`practiceContents.${index}.possibleVertices`}
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    placeholder="Comma-separated values"
                    onChange={(e) => field.onChange(e.target.value.split(',').map(Number))}
                  />
                )}
              />
            </Form.Group>

            <Form.Group controlId={`possibleEdges-${index}`} className="mb-3">
              <Form.Label>Possible Edges</Form.Label>
              <Controller
                control={control}
                name={`practiceContents.${index}.possibleEdges`}
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    placeholder="Comma-separated values"
                    onChange={(e) => field.onChange(e.target.value.split(',').map(Number))}
                  />
                )}
              />
            </Form.Group>

            <Form.Group controlId={`graphProperties-${index}`} className="mb-3">
              <Form.Label>Graph Properties</Form.Label>
              <Controller
                control={control}
                name={`practiceContents.${index}.graphProperties`}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={graphPropertyOptions}
                    onChange={(selectedOptions) => field.onChange(selectedOptions.map(option => option.value))}
                    value={graphPropertyOptions.filter(option => field.value.includes(option.value))}
                  />
                )}
              />
            </Form.Group>

            <Button variant="danger" onClick={() => remove(index)}>Remove Content</Button>
          </div>
        ))}

        <Container className='d-flex justify-content-between'>
          <Button className="my-2" variant="secondary" onClick={() => append({
            contentType: '',
            title: '',
            data: '',
            mediaLink: '',
            possibleVertices: [],
            possibleEdges: [],
            graphProperties: []
          })}>
            Add Content
          </Button>

          <Button type="submit" variant="primary" className="my-2">Submit</Button>
        </Container>
      </Form>
    </Container>
  );
};

export default PracticeForm;
