"use client";
import React, { FC } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray, FieldProps } from 'formik';
import { Col, Row, Form as BootstrapForm, Button } from 'react-bootstrap';
import { getNewBlogPostEnSchema } from '@/schemas/new-blog-post-en-schema';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faMinus, faPaperPlane, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import { useCreateBlogPostEnMutation } from '@/hooks/use-blog-posts';
import { CreateBlogPostTextEnDto } from '@/dtos/blog-post-dto';
import { useRouter } from '@/i18n/routing';
import 'react-datepicker/dist/react-datepicker.css';
import BlogPost from '@/interfaces/i-blog-post';
import RequiredFormLabel from './required-form-label';

const baseTPath = 'components.NewBlogPostEnForm';

const initialValues = {
  titleEn: '',
  summaryEn: '',
  contentEn: '',
  pageDescriptionEn: '',
  keywords: [''],
  dateTime: new Date(),
}

interface NewBlogPostEnFormProps {
  onSuccess: (blogPost: BlogPost) => void;
}

const NewBlogPostEnForm: FC<NewBlogPostEnFormProps> = ({ onSuccess }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();
  const { mutateAsync: createBlogPostEnMutation, isPending: isPendingCreateBlogPost } = useCreateBlogPostEnMutation();

  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }  
  ) => {
    const blogPostTextEnDto: CreateBlogPostTextEnDto = {
      titleEn: values.titleEn,
      summaryEn: values.summaryEn,
      contentEn: values.contentEn,
      pageDescriptionEn: values.pageDescriptionEn,
      keywords: values.keywords,
      dateTime: values.dateTime,
    };
    
    try {
      const createdBlogPost = await createBlogPostEnMutation(blogPostTextEnDto);
      // Call parent's onSuccess with the created id
      onSuccess(createdBlogPost);
    } catch (error: any) {
      // Set a generic error message
      actions.setStatus({ error: error.message || "Failed to create blog post." });
    } finally {
      actions.setSubmitting(false);
    }
    
  }

  return (
    <>
      <Row>
        <Col>
          <Formik
            initialValues={initialValues}
            validationSchema={getNewBlogPostEnSchema(t)}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, status }) => (
              <Form>
                <fieldset disabled={isSubmitting}>
                  <BootstrapForm.Group className="mb-4" controlId="formTitleEn">
                    <RequiredFormLabel>{t('titleEnLabel')}</RequiredFormLabel>
                    <Field name="titleEn" type="text" placeholder={t('titleEnPlaceholder')} className="form-control" />
                    <ErrorMessage name="titleEn" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formSummaryEn">
                    <RequiredFormLabel>{t('summaryEnLabel')}</RequiredFormLabel>
                    <Field as="textarea" name="summaryEn" placeholder={t('summaryEnPlaceholder')} className="form-control" rows={3} />
                    <BootstrapForm.Text className="text-muted">{t('summaryEnHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="summaryEn" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formContentEn">
                    <RequiredFormLabel>{t('contentEnLabel')}</RequiredFormLabel>
                    <Field as="textarea" name="contentEn" placeholder={t('contentEnPlaceholder')} className="form-control" rows={8} />
                    <BootstrapForm.Text className="text-muted">{t('contentEnHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="contentEn" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formPageDescriptionEn">
                    <RequiredFormLabel>{t('pageDescriptionEnLabel')}</RequiredFormLabel>
                    <Field as="textarea" name="pageDescriptionEn" placeholder={t('pageDescriptionEnPlaceholder')} className="form-control" rows={3} />
                    <BootstrapForm.Text className="text-muted">{t('pageDescriptionEnHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="pageDescriptionEn" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formKeywords">
                    <RequiredFormLabel>{t('keywordsLabel')}</RequiredFormLabel>
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
                    <RequiredFormLabel>{t('dateTimeLabel')}</RequiredFormLabel>
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
                          icon={<i className="bi bi-calendar2-check-fill"></i>}
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
                  <div className="alert alert-danger mt-3">{status.error}</div>
                )}
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </>
  )
}

export default NewBlogPostEnForm;