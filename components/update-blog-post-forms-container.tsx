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
import BlogPostActiveStep from '@/enums/blog-post-active-step';

const baseTPath = 'components.UpdateBlogPostFormsContainer';

interface UpdateBlogPostFormsContainerProps {
  id: string;
}

const UpdateBlogPostFormsContainer:React.FC<UpdateBlogPostFormsContainerProps> = ({ id }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as BlogPostActiveStep | null;
  const t = useTranslations(baseTPath);

  const { data: blogPost } = useBlogPostByIdQuery(id || '');
  const [step, setStep] = useState<BlogPostActiveStep>(stepParam || BlogPostActiveStep.EN);

  const stepLabels: Record<BlogPostActiveStep, string> = {
    [BlogPostActiveStep.EN]: t('stepEn'),
    [BlogPostActiveStep.SI]: t('stepSi'),
    [BlogPostActiveStep.PRIMARY_IMAGE]: t('stepPrimaryImage'),
  };

  const handleEnSubmit = (createdBlogPost: BlogPost) => {
    setStep(BlogPostActiveStep.SI);
    router.push(`/dashboard/blog/${id}/edit?step=${BlogPostActiveStep.SI}`);
  };

  const handleSiSubmit = (updatedBlogPost: BlogPost) => {
    setStep(BlogPostActiveStep.PRIMARY_IMAGE);
    router.push(`/dashboard/blog/${id}/edit?step=${BlogPostActiveStep.PRIMARY_IMAGE}`);
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
          { step === BlogPostActiveStep.EN && (
            <UpdateBlogPostEnForm id={id} onSuccess={handleEnSubmit} />
          )}
          { step === BlogPostActiveStep.SI && blogPost && (
            <UpdateBlogPostSiForm id={blogPost.id} v={blogPost.v} onSuccess={handleSiSubmit} />
          )}
          { step === BlogPostActiveStep.PRIMARY_IMAGE && blogPost && (
            <UpdateBlogPostPrimaryImageForm id={blogPost.id} onSuccess={handlePrimaryImageSubmit} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default UpdateBlogPostFormsContainer;