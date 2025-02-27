"use client";
import React, { FC, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray, FieldProps } from 'formik';
import { Col, Row, Form as BootstrapForm, Button } from 'react-bootstrap';
import { getNewBlogPostEnSchema } from '@/schemas/new-blog-post-en-schema';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faCircleNotch, faMinus, faPaperPlane, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import { useBlogPostByIdQuery, useUpdateBlogPostEnMutation } from '@/hooks/use-blog-posts';
import { UpdateBlogPostTextEnDto } from '@/dtos/blog-post-dto';
import DocumentStatus from '@/enums/document-status';
import { useRouter } from '@/i18n/routing';
import 'react-datepicker/dist/react-datepicker.css';
import BlogPost from '@/interfaces/i-blog-post';
import LoadingContainer from './loading-container';

const baseTPath = 'components.NewBlogPostEnForm';

interface UpdateBlogPostEnFormProps {
  id: string;
  onSuccess: (blogPost: BlogPost) => void;
}

const UpdateBlogPostEnForm: FC<UpdateBlogPostEnFormProps> = ({ id, onSuccess }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();

  const { data: blogPost, isPending, isError, isFetching, isSuccess, error } = useBlogPostByIdQuery(id);
  const { mutateAsync: updateBlogPostEnMutation, isPending: isPendingUpdateBlogPost } = useUpdateBlogPostEnMutation();

  const initialValues = useMemo(() => {
    return blogPost
      ? {
          titleEn: blogPost.titleEn || '',
          summaryEn: blogPost.summaryEn || '',
          contentEn: blogPost.contentEn || '',
          pageDescriptionEn: blogPost.pageDescriptionEn || '',
          keywords: blogPost.keywords?.length ? blogPost.keywords : [''],
          dateTime: blogPost.dateTime ? new Date(blogPost.dateTime) : new Date(),
          v: blogPost.v || 0,
        }
      : {
          titleEn: '',
          summaryEn: '',
          contentEn: '',
          pageDescriptionEn: '',
          keywords: [''],
          dateTime: new Date(),
          v: 0,
        };
  }, [blogPost]);

  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }  
  ) => {
    const blogPostTextEnDto: UpdateBlogPostTextEnDto = {
      titleEn: values.titleEn,
      summaryEn: values.summaryEn,
      contentEn: values.contentEn,
      pageDescriptionEn: values.pageDescriptionEn,
      status: DocumentStatus.ACTIVE,
      keywords: values.keywords,
      dateTime: values.dateTime,
      v: values.v
    };
    
    try {
      const updatedBlogPost = await updateBlogPostEnMutation({ id, blogPostTextEnDto });
      // Call parent's onSuccess
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
              validationSchema={getNewBlogPostEnSchema(t)}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ values, isSubmitting, status }) => (
                <Form>
                  <fieldset disabled={isSubmitting}>
                    <BootstrapForm.Group className="mb-4" controlId="formTitleEn">
                      <BootstrapForm.Label>{t('titleEnLabel')}</BootstrapForm.Label>
                      <Field name="titleEn" type="text" placeholder={t('titleEnPlaceholder')} className="form-control" />
                      <ErrorMessage name="titleEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formSummaryEn">
                      <BootstrapForm.Label>{t('summaryEnLabel')}</BootstrapForm.Label>
                      <Field as="textarea" name="summaryEn" placeholder={t('summaryEnPlaceholder')} className="form-control" rows={3} />
                      <BootstrapForm.Text className="text-muted">{t('summaryEnHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="summaryEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formContentEn">
                      <BootstrapForm.Label>{t('contentEnLabel')}</BootstrapForm.Label>
                      <Field as="textarea" name="contentEn" placeholder={t('contentEnPlaceholder')} className="form-control" rows={8} />
                      <BootstrapForm.Text className="text-muted">{t('contentEnHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="contentEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formPageDescriptionEn">
                      <BootstrapForm.Label>{t('pageDescriptionEnLabel')}</BootstrapForm.Label>
                      <Field as="textarea" name="pageDescriptionEn" placeholder={t('pageDescriptionEnPlaceholder')} className="form-control" rows={3} />
                      <BootstrapForm.Text className="text-muted">{t('pageDescriptionEnHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="pageDescriptionEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formKeywords">
                      <BootstrapForm.Label>{t('keywordsLabel')}</BootstrapForm.Label>
                      <FieldArray name="keywords">
                        {({ push, remove }) => (
                          <div>
                            { values.keywords && values.keywords.length > 0 && 
                              values.keywords.map((keyword, index) => (
                                <div key={index} className="d-flex mb-2 align-items-center">
                                  <Field name={`keywords.${index}`} className="form-control me-2" />
                                  <Button variant="danger" type="button" onClick={() => remove(index)}>
                                    <FontAwesomeIcon icon={faMinus} />
                                  </Button>
                                </div>
                            ))}
                            <Button variant="primary" type="button" onClick={() => push('')}>
                              <FontAwesomeIcon icon={faPlus} />
                            </Button>
                          </div>
                        )}
                      </FieldArray>
                      <ErrorMessage name="keywords" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formDateTime">
                      <BootstrapForm.Label>{t('dateTimeLabel')}</BootstrapForm.Label>
                      <Field name="dateTime" type="text" className="form-control">
                        {({ field, form }: FieldProps) => (
                          <DatePicker
                            wrapperClassName="w-100"
                            className="form-control"
                            closeOnScroll={true}
                            isClearable={true}
                            showIcon={true}
                            selected={field.value ? new Date(field.value) : null}
                            onChange={date => form.setFieldValue(field.name, date)}
                            dateFormat="dd-MM-yyyy h:mm aa"
                            timeInputLabel={t('dateTimeInputLabel')}
                            showTimeInput={true}
                            placeholderText={t('dateTimePlaceholder')}
                            icon={<FontAwesomeIcon icon={faCalendarDays} />}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="dateTime" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                  </fieldset>
                  <div className="d-flex justify-content-between mt-4">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => router.push('/dashboard/blog')}
                    >
                      <FontAwesomeIcon icon={faXmark} className="me-1" /> {t('cancel')}
                    </Button>
                    <Button variant="success" type="submit" disabled={isSubmitting || isPendingUpdateBlogPost}>
                      {isSubmitting || isPendingUpdateBlogPost ? (
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

export default UpdateBlogPostEnForm;