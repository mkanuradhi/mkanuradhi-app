"use client";
import React, { FC, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Col, Row, Form as BootstrapForm, Button } from 'react-bootstrap';
import { getUpdateBlogPostSiSchema } from '@/schemas/update-blog-post-si-schema';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useBlogPostByIdQuery, useUpdateBlogPostSiMutation } from '@/hooks/use-blog-posts';
import { UpdateBlogPostTextSiDto } from '@/dtos/blog-post-dto';
import BlogPost from '@/interfaces/i-blog-post';
import LoadingContainer from './loading-container';

const baseTPath = 'components.UpdateBlogPostSiForm';

interface UpdateBlogPostSiFormProps {
  id: string;
  v: number;
  onSuccess: (blogPost: BlogPost) => void;
}

const UpdateBlogPostSiForm: FC<UpdateBlogPostSiFormProps> = ({id, onSuccess }) => {
  const t = useTranslations(baseTPath);

  const { data: blogPost, isPending, isError, isFetching, isSuccess, error } = useBlogPostByIdQuery(id);
  const { mutateAsync: updateBlogPostSiMutation, isPending: isPendingCreateBlogPost } = useUpdateBlogPostSiMutation();

  const initialValues = useMemo(() => {
    return blogPost
      ? {
          titleSi: blogPost.titleSi || '',
          summarySi: blogPost.summarySi || '',
          contentSi: blogPost.contentSi || '',
          pageDescriptionSi: blogPost.pageDescriptionSi || '',
          v: blogPost.v || 0,
        }
      : {
          titleSi: '',
          summarySi: '',
          contentSi: '',
          pageDescriptionSi: '',
          v: 0,
        };
  }, [blogPost]);

  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }  
  ) => {
    const blogPostTextSiDto: UpdateBlogPostTextSiDto = {
      titleSi: values.titleSi,
      summarySi: values.summarySi,
      contentSi: values.contentSi,
      pageDescriptionSi: values.pageDescriptionSi,
      v: values.v,
    };
    
    try {
      const updatedBlogPost = await updateBlogPostSiMutation({ id, blogPostTextSiDto });
      // Call parent's onSuccess with the created id
      onSuccess(updatedBlogPost);
    } catch (error: any) {
      // Set a generic error message
      actions.setStatus({ error: error.message || "Failed to update blog post." });
    } finally {
      actions.setSubmitting(false);
    }
  }

  return (
    <>
      {isError && (
        <Row>
          <Col>{ error.message }</Col>
        </Row>
      )}
      {isPending || isFetching && (
        <LoadingContainer />
      )}
      {isSuccess && blogPost && (
        <Row>
          <Col>
            <Formik
              initialValues={initialValues}
              validationSchema={getUpdateBlogPostSiSchema(t)}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ isSubmitting, status }) => (
                <Form>
                  <fieldset disabled={isSubmitting}>
                    <BootstrapForm.Group className="mb-4" controlId="formTitleSi">
                      <BootstrapForm.Label>{t('titleSiLabel')}</BootstrapForm.Label>
                      <Field name="titleSi" type="text" placeholder={t('titleSiPlaceholder')} className="form-control" />
                      <ErrorMessage name="titleSi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formSummarySi">
                      <BootstrapForm.Label>{t('summarySiLabel')}</BootstrapForm.Label>
                      <Field as="textarea" name="summarySi" placeholder={t('summarySiPlaceholder')} className="form-control" rows={3} />
                      <BootstrapForm.Text className="text-muted">{t('summarySiHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="summarySi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formContentSi">
                      <BootstrapForm.Label>{t('contentSiLabel')}</BootstrapForm.Label>
                      <Field as="textarea" name="contentSi" placeholder={t('contentSiPlaceholder')} className="form-control" rows={8} />
                      <BootstrapForm.Text className="text-muted">{t('contentSiHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="contentSi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formPageDescriptionSi">
                      <BootstrapForm.Label>{t('pageDescriptionSiLabel')}</BootstrapForm.Label>
                      <Field as="textarea" name="pageDescriptionSi" placeholder={t('pageDescriptionSiPlaceholder')} className="form-control" rows={3} />
                      <BootstrapForm.Text className="text-muted">{t('pageDescriptionSiHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="pageDescriptionSi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                  </fieldset>
                  <div className="d-flex justify-content-end mt-4">
                    <Button variant="success" type="submit" disabled={isSubmitting || isPendingCreateBlogPost}>
                      {isSubmitting || isPendingCreateBlogPost ? (
                        <>
                          <FontAwesomeIcon icon={faCircleNotch} className="me-1" spin /> {t('submitting')}
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faPaperPlane} className="me-1" /> {t('submit')}
                        </>
                      )}
                    </Button>
                  </div>
                  {status && status.error && (
                    <div className="alert alert-danger">{status.error}</div>
                  )}
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      )}
    </>
  )
}

export default UpdateBlogPostSiForm;