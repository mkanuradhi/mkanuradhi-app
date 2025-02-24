"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import NewBlogPostEnForm from './new-blog-post-en-form';

enum BlogPostActiveStep {
  EN, SI, PRIMARY_IMAGE,
}

const NewBlogPostFormWrapper = () => {
  const [step, setStep] = useState<BlogPostActiveStep>(BlogPostActiveStep.EN);
  const [blogPostId, setBlogPostId] = useState<string | null>(null);

  const handleEnSubmit = (createdId: string) => {
    setBlogPostId(createdId);
    setStep(BlogPostActiveStep.SI);
    console.log('Created blog post with id:', createdId);
    console.log('step:', step);
  };

  return (
    <>
      <Row>
        <Col>
          { step === BlogPostActiveStep.EN && (
            <NewBlogPostEnForm onSuccess={handleEnSubmit} />
          )}
          { step === BlogPostActiveStep.SI && (
            // <NewBlogPostSiForm onSuccess={() => {}} />
            <p>Step in si</p>
          )}
        </Col>
      </Row>
    </>
  )
}

export default NewBlogPostFormWrapper;