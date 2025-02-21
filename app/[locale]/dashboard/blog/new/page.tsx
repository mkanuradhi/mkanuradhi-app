import React from 'react';
import NewBlogPostEnForm from '@/components/new-blog-post-en-form';
import { Col, Row } from 'react-bootstrap';

const NewBlogPostPage = () => {
  return (
    <>
      <Row>
        <Col>
          <h1>Add New Blog Post</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <NewBlogPostEnForm />
        </Col>
      </Row>
    </>
  )
}

export default NewBlogPostPage;