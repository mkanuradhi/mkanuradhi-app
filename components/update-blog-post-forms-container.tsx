"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import BlogPost from '@/interfaces/i-blog-post';
import UpdateBlogPostSiForm from './update-blog-post-si-form';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useBlogPostByIdQuery } from '@/hooks/use-blog-posts';
import { useTranslations } from 'next-intl';
import UpdateBlogPostPrimaryImageForm from './update-blog-post-primary-image-form';
import UpdateBlogPostEnForm from './update-blog-post-en-form';
import ActiveStep from '@/enums/active-step';

const baseTPath = 'components.UpdateBlogPostFormsContainer';

interface UpdateBlogPostFormsContainerProps {
  id: string;
}

const UpdateBlogPostFormsContainer:React.FC<UpdateBlogPostFormsContainerProps> = ({ id }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as ActiveStep | null;
  const t = useTranslations(baseTPath);

  const { data: blogPost } = useBlogPostByIdQuery(id || '');
  const [step, setStep] = useState<ActiveStep>(stepParam || ActiveStep.EN);

  const stepLabels: Partial<Record<ActiveStep, string>> = {
    [ActiveStep.EN]: t('stepEn'),
    [ActiveStep.SI]: t('stepSi'),
    [ActiveStep.PRIMARY_IMAGE]: t('stepPrimaryImage'),
  };

  const handleEnSubmit = (createdBlogPost: BlogPost) => {
    setStep(ActiveStep.SI);
    router.push(`/dashboard/blog/${id}/edit?step=${ActiveStep.SI}`);
  };

  const handleSiSubmit = (updatedBlogPost: BlogPost) => {
    setStep(ActiveStep.PRIMARY_IMAGE);
    router.push(`/dashboard/blog/${id}/edit?step=${ActiveStep.PRIMARY_IMAGE}`);
  };

  const handlePrimaryImageSubmit = (updatedBlogPost: BlogPost) => {
    router.push(`/dashboard/blog/${updatedBlogPost.id}`);
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
            <UpdateBlogPostEnForm id={id} onSuccess={handleEnSubmit} />
          )}
          { step === ActiveStep.SI && blogPost && (
            <UpdateBlogPostSiForm id={blogPost.id} v={blogPost.v} onSuccess={handleSiSubmit} />
          )}
          { step === ActiveStep.PRIMARY_IMAGE && blogPost && (
            <UpdateBlogPostPrimaryImageForm id={blogPost.id} onSuccess={handlePrimaryImageSubmit} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default UpdateBlogPostFormsContainer;