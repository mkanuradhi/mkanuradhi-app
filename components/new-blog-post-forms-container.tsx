"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import NewBlogPostEnForm from './new-blog-post-en-form';
import BlogPost from '@/interfaces/i-blog-post';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import BlogPostActiveStep from '@/enums/blog-post-active-step';

const baseTPath = 'components.NewBlogPostFormsContainer';

const NewBlogPostFormsContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as BlogPostActiveStep | null;
  const t = useTranslations(baseTPath);

  const [step, setStep] = useState<BlogPostActiveStep>(stepParam || BlogPostActiveStep.EN);

  const stepLabels: Record<BlogPostActiveStep, string> = {
    [BlogPostActiveStep.EN]: t('stepEn'),
    [BlogPostActiveStep.SI]: t('stepSi'),
    [BlogPostActiveStep.PRIMARY_IMAGE]: t('stepPrimaryImage'),
  };

  const handleEnSubmit = (createdBlogPost: BlogPost) => {
    setStep(BlogPostActiveStep.SI);
    router.push(`/dashboard/blog/${createdBlogPost.id}/edit?step=${BlogPostActiveStep.SI}`);
  };

  return (
    <>
      <Row className="my-3">
        <Col>
          <h4>{stepLabels[step]}</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          { step === BlogPostActiveStep.EN && (
            <NewBlogPostEnForm onSuccess={handleEnSubmit} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default NewBlogPostFormsContainer;