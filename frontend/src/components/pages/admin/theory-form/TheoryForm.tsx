import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import theoryService, { GraphNode, GraphLink, TheoryContent, Theory } from '../../../../service/TheoryService';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

const contentTypeOptions = [
  { value: 'Example', label: 'Example' },
  { value: 'Graph', label: 'Graph' },
  { value: 'Article', label: 'Article' },
  // Добавьте другие типы контента, если необходимо
];

const TheoryForm = () => {
  const { control, handleSubmit, register, setValue, watch } = useForm<Theory>({
    defaultValues: {
      title: '',
      theoryContents: [{
        contentType: '',
        title: '',
        data: '',
        mediaLink: '',
        graphData: [{
          title: '',
          oriented: false,
          nodes: [],
          links: []
        }]
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'theoryContents'
  });

  const [inputTypes, setInputTypes] = useState<string[][]>(fields.map(() => ['matrix']));


  const handleNodeChange = (contentIndex: number, graphIndex: number, nodeIndex: number, field: keyof GraphNode, value: string) => {
    const graphData = watch(`theoryContents.${contentIndex}.graphData`);
    graphData[graphIndex].nodes[nodeIndex][field] = value;
    setValue(`theoryContents.${contentIndex}.graphData`, graphData);
  };

  const handleLinkChange = (contentIndex: number, graphIndex: number, linkIndex: number, field: keyof GraphLink, value: string) => {
    const graphData = watch(`theoryContents.${contentIndex}.graphData`);
    const currentLink = graphData[graphIndex].links[linkIndex];

    const nodes = graphData[graphIndex].nodes.map(node => node.nodeId);
    if (field === 'source' || field === 'target') {
      if (!nodes.includes(value)) {
        console.error(`Node with ID ${value} does not exist`);
        return;
      }
    }

    const duplicateLink = graphData[graphIndex].links.some((link, i) =>
      i !== linkIndex && link.source === (field === 'source' ? value : currentLink.source) && link.target === (field === 'target' ? value : currentLink.target)
    );

    if (duplicateLink) {
      console.error(`Link from ${currentLink.source} to ${currentLink.target} already exists`);
      return;
    }

    graphData[graphIndex].links[linkIndex][field] = value;
    setValue(`theoryContents.${contentIndex}.graphData`, graphData);
  };

  const addNode = (contentIndex: number, graphIndex: number) => {
    const graphData = watch(`theoryContents.${contentIndex}.graphData`);
    graphData[graphIndex].nodes.push({ nodeId: '' });
    setValue(`theoryContents.${contentIndex}.graphData`, graphData);
  };

  const addLink = (contentIndex: number, graphIndex: number) => {
    const graphData = watch(`theoryContents.${contentIndex}.graphData`);
    graphData[graphIndex].links.push({ source: '', target: '', linkId: '', weight: '' });
    setValue(`theoryContents.${contentIndex}.graphData`, graphData);
  };

  const removeNode = (contentIndex: number, graphIndex: number, nodeIndex: number) => {
    const graphData = watch(`theoryContents.${contentIndex}.graphData`);
    graphData[graphIndex].nodes.splice(nodeIndex, 1);
    setValue(`theoryContents.${contentIndex}.graphData`, graphData);
  };

  const removeLink = (contentIndex: number, graphIndex: number, linkIndex: number) => {
    const graphData = watch(`theoryContents.${contentIndex}.graphData`);
    graphData[graphIndex].links.splice(linkIndex, 1);
    setValue(`theoryContents.${contentIndex}.graphData`, graphData);
  };
  const addGraphData = (contentIndex: number) => {
    const graphData = watch(`theoryContents.${contentIndex}.graphData`);
    graphData.push({ title: '', oriented: false, nodes: [], links: [] });
    setValue(`theoryContents.${contentIndex}.graphData`, graphData);

    const newInputTypes = [...inputTypes];
    newInputTypes[contentIndex] = [...newInputTypes[contentIndex], 'matrix'];
    setInputTypes(newInputTypes);
  };

  const removeGraphData = (contentIndex: number, graphIndex: number) => {
    const graphData = watch(`theoryContents.${contentIndex}.graphData`);
    graphData.splice(graphIndex, 1);
    setValue(`theoryContents.${contentIndex}.graphData`, graphData);

    const newInputTypes = [...inputTypes];
    newInputTypes[contentIndex].splice(graphIndex, 1);
    setInputTypes(newInputTypes);
  };

  const onSubmit = async (data: Theory) => {
    try {
      const response = await theoryService.createTheory(data);
      console.log('Theory created successfully', response);
    } catch (error) {
      console.error('Error creating theory', error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control {...register('title', { required: true })} placeholder="Enter title" />
        </Form.Group>

        {fields.map((field, contentIndex) => (
          <div key={field.id}>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId={`contentType-${contentIndex}`}>
                  <Form.Label>Content Type</Form.Label>
                  <Controller
                    control={control}
                    name={`theoryContents.${contentIndex}.contentType`}
                    render={({ field }) => (
                      <Select
                        options={contentTypeOptions}
                        onChange={(option) => field.onChange(option?.value)}
                        value={contentTypeOptions.find(option => option.value === field.value)}
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId={`title-${contentIndex}`}>
                  <Form.Label>Title</Form.Label>
                  <Form.Control {...register(`theoryContents.${contentIndex}.title`)} placeholder="Enter content title" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId={`data-${contentIndex}`} className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control as="textarea" rows={3} {...register(`theoryContents.${contentIndex}.data`)} placeholder="Enter content data" />
            </Form.Group>
            <Form.Group controlId={`mediaLink-${contentIndex}`} className="mb-3">
              <Form.Label>Media Link</Form.Label>
              <Form.Control {...register(`theoryContents.${contentIndex}.mediaLink`)} placeholder="Enter media link" />
            </Form.Group>

            <Controller
              control={control}
              name={`theoryContents.${contentIndex}.graphData`}
              render={({ field }) => (
                <div className='border-bottom border-2'>
                  {field.value.map((graphField, graphIndex) => (
                    <div key={graphIndex} className="mb-3">
                      <Form.Group controlId={`graphDataTitle-${contentIndex}-${graphIndex}`} className="mb-3">
                        <Form.Label>Graph Data Title</Form.Label>
                        <Form.Control
                          {...register(`theoryContents.${contentIndex}.graphData.${graphIndex}.title`)}
                          placeholder="Enter graph data title"
                        />
                      </Form.Group>

                      <Form.Group controlId={`graphDataOriented-${contentIndex}-${graphIndex}`} className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Oriented"
                          className='d-flex justify-content-center'
                          {...register(`theoryContents.${contentIndex}.graphData.${graphIndex}.oriented`)}
                        />
                      </Form.Group>
                      <div>
                        <h5>Nodes</h5>
                        {graphField.nodes.map((node, nodeIndex) => (
                          <Row key={nodeIndex} className="mb-2">
                            <Col>
                              <Form.Control
                                placeholder="Node ID"
                                value={node.nodeId}
                                onChange={(e) => handleNodeChange(contentIndex, graphIndex, nodeIndex, 'nodeId', e.target.value)}
                              />
                            </Col>
                            <Col>
                              <Form.Control
                                placeholder="Group"
                                value={node.group || ''}
                                onChange={(e) => handleNodeChange(contentIndex, graphIndex, nodeIndex, 'group', e.target.value)}
                              />
                            </Col>
                            <Col>
                              <Button variant="danger" onClick={() => removeNode(contentIndex, graphIndex, nodeIndex)}>Remove</Button>
                            </Col>
                          </Row>
                        ))}
                        <div className='w-100 mb-4 p-0 btn btn-outline-primary' onClick={() => addNode(contentIndex, graphIndex)}>Add Node</div>

                        <h5>Links</h5>
                        {graphField.links.map((link, linkIndex) => (
                          <Row key={linkIndex} className="mb-2">
                            <Col>
                              <Form.Control
                                placeholder="Source"
                                value={link.source}
                                onChange={(e) => handleLinkChange(contentIndex, graphIndex, linkIndex, 'source', e.target.value)}
                              />
                            </Col>
                            <Col>
                              <Form.Control
                                placeholder="Target"
                                value={link.target}
                                onChange={(e) => handleLinkChange(contentIndex, graphIndex, linkIndex, 'target', e.target.value)}
                              />
                            </Col>
                            <Col>
                              <Form.Control
                                placeholder="Id"
                                value={link.linkId}
                                onChange={(e) => handleLinkChange(contentIndex, graphIndex, linkIndex, 'linkId', e.target.value)}
                              />
                            </Col>
                            <Col>
                              <Form.Control
                                placeholder="Weight"
                                value={link.weight}
                                onChange={(e) => handleLinkChange(contentIndex, graphIndex, linkIndex, 'weight', e.target.value)}
                              />
                            </Col>
                            <Col>
                              <Button variant="danger" onClick={() => removeLink(contentIndex, graphIndex, linkIndex)}>Remove</Button>
                            </Col>
                          </Row>
                        ))}
                        <div className='w-100 mb-4 p-0 btn btn-outline-primary' onClick={() => addLink(contentIndex, graphIndex)}>Add Link</div>
                      </div>
                      <Button variant="danger" onClick={() => removeGraphData(contentIndex, graphIndex)} className="mt-3">Remove Graph</Button>
                    </div>
                  ))}
                  <Button onClick={() => addGraphData(contentIndex)} className='w-100 mb-4 p-0 btn-success'>Add Graph Data</Button>
                </div>
              )}
            />
            <Button className="my-3" variant="danger" onClick={() => remove(contentIndex)}>Remove Content</Button>
          </div>
        ))}
        <Container className='d-flex justify-content-between'>
          <Button className='m-2' variant="secondary" onClick={() => append({
            contentType: '',
            title: '',
            data: '',
            mediaLink: '',
            graphData: [{
              title: '',
              oriented: false,
              nodes: [],
              links: []
            }]
          })}>
            Add Content
          </Button>
          <Button type="submit" variant="primary" className="my-2">Submit</Button>
        </Container>

      </Form>
    </Container>
  );
};

export default TheoryForm;
