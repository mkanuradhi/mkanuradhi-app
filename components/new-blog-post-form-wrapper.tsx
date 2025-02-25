"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import NewBlogPostEnForm from './new-blog-post-en-form';
import BlogPost from '@/interfaces/i-blog-post';
import UpdateBlogPostSiForm from './update-blog-post-si-form';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useBlogPostByIdQuery } from '@/hooks/use-blog-posts';
import { useTranslations } from 'next-intl';

const baseTPath = 'components.NewBlogPostFormWrapper';

enum BlogPostActiveStep {
  EN = "EN",
  SI = "SI",
  PRIMARY_IMAGE = "PRIMARY_IMAGE",
}

const NewBlogPostFormWrapper = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as BlogPostActiveStep | null;
  const idParam = searchParams.get("id");
  const t = useTranslations(baseTPath);

  const { data: blogPost } = useBlogPostByIdQuery(idParam || '');
  const [step, setStep] = useState<BlogPostActiveStep>(stepParam || BlogPostActiveStep.EN);

  const stepLabels: Record<BlogPostActiveStep, string> = {
    [BlogPostActiveStep.EN]: t('stepEn'),
    [BlogPostActiveStep.SI]: t('stepSi'),
    [BlogPostActiveStep.PRIMARY_IMAGE]: t('stepPrimaryImage'),
  };

  const handleEnSubmit = (createdBlogPost: BlogPost) => {
    setStep(BlogPostActiveStep.SI);
    router.push(`/dashboard/blog/new?step=${BlogPostActiveStep.SI}&id=${createdBlogPost.id}`);
  };

  const handleSiSubmit = (updatedBlogPost: BlogPost) => {
    setStep(BlogPostActiveStep.PRIMARY_IMAGE);
    router.push(`/dashboard/blog/new?step=${BlogPostActiveStep.PRIMARY_IMAGE}&id=${updatedBlogPost.id}`);
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
          { step === BlogPostActiveStep.SI && blogPost && (
            <UpdateBlogPostSiForm id={blogPost.id} v={blogPost.v} onSuccess={handleSiSubmit} />
          )}
          { step === BlogPostActiveStep.PRIMARY_IMAGE && blogPost && (
            <p>Primary image step</p>
          )}
        </Col>
      </Row>
    </>
  )
}

export default NewBlogPostFormWrapper;