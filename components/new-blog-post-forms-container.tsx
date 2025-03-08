"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import NewBlogPostEnForm from './new-blog-post-en-form';
import BlogPost from '@/interfaces/i-blog-post';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ActiveStep from '@/enums/active-step';

const baseTPath = 'components.NewBlogPostFormsContainer';

const NewBlogPostFormsContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as ActiveStep | null;
  const t = useTranslations(baseTPath);

  const [step, setStep] = useState<ActiveStep>(stepParam || ActiveStep.EN);

  const stepLabels: Record<ActiveStep, string> = {
    [ActiveStep.EN]: t('stepEn'),
    [ActiveStep.SI]: t('stepSi'),
    [ActiveStep.PRIMARY_IMAGE]: t('stepPrimaryImage'),
  };

  const handleEnSubmit = (createdBlogPost: BlogPost) => {
    setStep(ActiveStep.SI);
    router.push(`/dashboard/blog/${createdBlogPost.id}/edit?step=${ActiveStep.SI}`);
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
          { step === ActiveStep.EN && (
            <NewBlogPostEnForm onSuccess={handleEnSubmit} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default NewBlogPostFormsContainer;