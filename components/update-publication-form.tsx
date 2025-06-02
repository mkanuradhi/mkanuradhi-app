"use client";
import React, { useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps, FieldArray } from 'formik';
import { Col, Row, Form as BootstrapForm, Button, InputGroup } from 'react-bootstrap';
import { getNewPublicationSchema } from '@/schemas/new-publication-schema';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faMinus, faPaperPlane, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { usePublicationByIdQuery, useUpdatePublicationMutation } from '@/hooks/use-publications';
import { useRouter } from '@/i18n/routing';
import RequiredFormLabel from './required-form-label';
import Publication from '@/interfaces/i-publication';
import { UpdatePublicationDto } from '@/dtos/publication-dto';
import LoadingContainer from './loading-container';
import PublicationType from '@/enums/publication-type';
import PublicationStatus from '@/enums/publication-status';


const baseTPath = 'components.NewPublicationForm';

interface UpdatePublicationFormProps {
  publicationId: string;
  onSuccess: (publication: Publication) => void;
}

const UpdatePublicationForm: React.FC<UpdatePublicationFormProps> = ({ publicationId, onSuccess }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();

  const { data: publication, isPending, isError, isFetching, isSuccess, error } = usePublicationByIdQuery(publicationId);
  const { mutateAsync: updatePublicationMutation, isPending: isPendingUpdatePublication } = useUpdatePublicationMutation();

  const initialValues = useMemo(() => {
      return publication
        ? {
            type: publication.type || PublicationType.JOURNAL_ARTICLE,
            year: publication.year || new Date().getFullYear(),
            title: publication.title || '',
            source: publication.source || '',
            authors: publication.authors ? publication.authors : [
              { name: '', isMe: false, corresponding: false },
            ],
            publicationStatus: publication.publicationStatus || PublicationStatus.PUBLISHED,
            tags: publication.tags?.length > 0 ? publication.tags : [''],
            publicationUrl: publication.publicationUrl || '',
            pdfUrl: publication.pdfUrl || '',
            doiUrl: publication.doiUrl || '',
            preprintUrl: publication.preprintUrl || '',
            abstract: publication.abstract || '',
            bibtex: publication.bibtex || '',
            v: publication.v || 0,
          }
        : {
            type: PublicationType.JOURNAL_ARTICLE,
            year: new Date().getFullYear(),
            title: '',
            source: '',
            authors: [
              { name: '', isMe: false, corresponding: false },
            ],
            publicationStatus: PublicationStatus.PUBLISHED,
            tags: [''],
            publicationUrl: '',
            pdfUrl: '',
            doiUrl: '',
            preprintUrl: '',
            abstract: '',
            bibtex: '',
            v: 0,
          };
    }, [publication]);

  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }  
  ) => {
    const publicationDto: UpdatePublicationDto = {
      type: values.type,
      year: values.year,
      title: values.title,
      source: values.source,
      authors: values.authors,
      publicationStatus: values.publicationStatus,
      tags: values.tags,
      publicationUrl: values.publicationUrl,
      pdfUrl: values.pdfUrl,
      doiUrl: values.doiUrl,
      preprintUrl: values.preprintUrl,
      abstract: values.abstract,
      bibtex: values.bibtex,
      v: values.v,
    };
    
    try {
      const updatedPublication = await updatePublicationMutation({publicationId, publicationDto});
      // Call parent's onSuccess with the created id
      onSuccess(updatedPublication);
    } catch (error: any) {
      // Set a generic error message
      actions.setStatus({ error: error.message || "Failed to update publication." });
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
      {isSuccess && publication && (
      <Row>
        <Col>
          <Formik
            initialValues={initialValues}
            validationSchema={getNewPublicationSchema(t)}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, status }) => (
              <Form>
                <fieldset disabled={isSubmitting}>
                  <BootstrapForm.Group className="mb-4" controlId="formType">
                    <RequiredFormLabel>{t('typeLabel')}</RequiredFormLabel>
                    <Field as="select" name="type" className="form-select">
                      {Object.values(PublicationType).map((type) => (
                        <option key={type} value={type}>
                          {t(`publicationType.${type}`)}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="type" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formYear">
                    <RequiredFormLabel>{t('yearLabel')}</RequiredFormLabel>
                    <Field name="year" type="text" placeholder={t('yearPlaceholder')} className="form-control" />
                    <ErrorMessage name="year" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formTitle">
                    <RequiredFormLabel>{t('titleLabel')}</RequiredFormLabel>
                    <Field name="title" type="text" placeholder={t('titlePlaceholder')} className="form-control" />
                    <ErrorMessage name="title" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formSource">
                    <BootstrapForm.Label>{t('sourceLabel')}</BootstrapForm.Label>
                    <Field name="source" type="text" placeholder={t('sourcePlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('sourceHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="source" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formAuthors">
                    <RequiredFormLabel>{t('authorsLabel')}</RequiredFormLabel>
                    <FieldArray name="authors">
                      {({ push, remove }) => (
                        <div>
                          {values.authors && values.authors.length > 0 &&
                            values.authors.map((_, index) => (
                              <div key={index} className="mb-4 border rounded p-2">
                                <div className="d-flex align-items-start mb-2">
                                  {/* Author Name */}
                                  <div className="flex-grow-1 me-2">
                                    <Field name={`authors.${index}.name`}>
                                      {({ field }: FieldProps) => (
                                        <BootstrapForm.Control
                                          {...field}
                                          type="text"
                                          placeholder={t('authorPlaceholder')}
                                        />
                                      )}
                                    </Field>
                                    <ErrorMessage name={`authors.${index}.name`} component="p" className="text-danger mt-1" />
                                  </div>

                                  {/* Remove Button */}
                                  <Button
                                    variant={values.authors.length === 1 ? 'outline-danger' : 'danger'}
                                    type="button"
                                    onClick={() => {
                                      if (values.authors.length > 1) remove(index);
                                    }}
                                    disabled={values.authors.length === 1}
                                    title={values.authors.length === 1 ? t('authorCannotRemoveLast') : t('authorRemove')}
                                  >
                                    <FontAwesomeIcon icon={faMinus} />
                                  </Button>
                                </div>

                                <div className="d-flex gap-4 ps-1">
                                  {/* 'Me' Checkbox */}
                                  <div className="form-check">
                                    <Field name={`authors.${index}.isMe`}>
                                      {({ field, form }: FieldProps) => {
                                        // const alreadySelected = values.authors.some((author, i) => i !== index && author.isMe);
                                        const handleChange = () => {
                                          const updated = values.authors?.map((author, i) => ({
                                            ...author,
                                            isMe: i === index,
                                          }));
                                          form.setFieldValue("authors", updated);
                                        };
                                        return (
                                          <>
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              id={`author-${index}-isMe`}
                                              checked={field.value}
                                              onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor={`author-${index}-isMe`}>
                                              {t('authorIsMeLabel')}
                                            </label>
                                          </>
                                        );
                                      }}
                                    </Field>
                                  </div>

                                  {/* 'Corresponding' Checkbox */}
                                  <div className="form-check">
                                    <Field name={`authors.${index}.corresponding`}>
                                      {({ field, form }: FieldProps) => {
                                        const handleChange = () => {
                                          const updated = values.authors?.map((author, i) => {
                                            if (i === index) {
                                              return { ...author, corresponding: !author.corresponding };
                                            }
                                            return { ...author, corresponding: false };
                                          });
                                          form.setFieldValue("authors", updated);
                                        };
                                        return (
                                          <>
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              id={`author-${index}-corresponding`}
                                              checked={field.value}
                                              onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor={`author-${index}-corresponding`}>
                                              {t('authorCorrespondingLabel')}
                                            </label>
                                          </>
                                        );
                                      }}
                                    </Field>
                                  </div>
                                </div>
                              </div>
                            ))}

                          {/* Add Author Button */}
                          <Button
                            variant="primary"
                            type="button"
                            onClick={() => push({ name: '', isMe: false, corresponding: false })}
                            title={t('authorAdd')}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>

                          {/* Validation Summary */}
                          <ErrorMessage
                            name="authors"
                            render={(msg: any) => {
                              if (typeof msg === 'string') {
                                return <p className="text-danger mt-1">{msg}</p>;
                              }
                              if (Array.isArray(msg)) {
                                const errorMessages = msg
                                  .map((error) => {
                                    if (!error) return '';
                                    if (typeof error === 'string') return error;
                                    if (typeof error === 'object') {
                                      return Object.values(error).find(v => typeof v === 'string') || '';
                                    }
                                    return JSON.stringify(error);
                                  })
                                  .filter((message) => message);
                                return <p className="text-danger mt-1">{errorMessages.join(', ')}</p>;
                              }
                              return <p className="text-danger mt-1">{JSON.stringify(msg)}</p>;
                            }}
                          />
                        </div>
                      )}
                    </FieldArray>
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formPublicationStatus">
                    <RequiredFormLabel>{t('publicationStatusLabel')}</RequiredFormLabel>
                    <Field as="select" name="publicationStatus" className="form-select">
                      {Object.values(PublicationStatus).map((publicationStatus) => (
                        <option key={publicationStatus} value={publicationStatus}>
                          {t(`publicationStatus.${publicationStatus}`)}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="type" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formTags">
                    <BootstrapForm.Label>{t('tagsLabel')}</BootstrapForm.Label>
                    <FieldArray name="tags">
                      {({ push, remove }) => (
                        <div>
                          { values.tags && values.tags.length > 0 && 
                            values.tags.map((_, index) => (
                              <div key={index} className="d-flex mb-2 align-items-center">
                                <Field name={`tags.${index}`} className="form-control me-2" />
                                <Button variant="danger" type="button" onClick={() => remove(index)} title={t('tagsRemove')}>
                                  <FontAwesomeIcon icon={faMinus} />
                                </Button>
                              </div>
                          ))}
                          <Button variant="primary" type="button" onClick={() => push('')} title={t('tagsAdd')}>
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </div>
                      )}
                    </FieldArray>
                    <BootstrapForm.Text className="text-muted">{t('tagsHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="tags" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formPublicationUrl">
                    <BootstrapForm.Label>{t('publicationUrlLabel')}</BootstrapForm.Label>
                    <Field name="publicationUrl" type="url" placeholder={t('publicationUrlPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('publicationUrlHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="publicationUrl" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formPdfUrl">
                    <BootstrapForm.Label>{t('pdfUrlLabel')}</BootstrapForm.Label>
                    <Field name="pdfUrl" type="url" placeholder={t('pdfUrlPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('pdfUrlHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="pdfUrl" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formDoiUrl">
                    <BootstrapForm.Label>{t('doiUrlLabel')}</BootstrapForm.Label>
                    <Field name="doiUrl" type="url" placeholder={t('doiUrlPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('doiUrlHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="doiUrl" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formPreprintUrl">
                    <BootstrapForm.Label>{t('preprintUrlLabel')}</BootstrapForm.Label>
                    <Field name="preprintUrl" type="url" placeholder={t('preprintUrlPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('preprintUrlHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="preprintUrl" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formAbstract">
                    <BootstrapForm.Label>{t('abstractLabel')}</BootstrapForm.Label>
                    <Field as="textarea" name="abstract" placeholder={t('abstractPlaceholder')} className="form-control" rows={4} />
                    <ErrorMessage name="abstract" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formBibtex">
                    <BootstrapForm.Label>{t('bibtexLabel')}</BootstrapForm.Label>
                    <Field as="textarea" name="bibtex" placeholder={t('bibtexPlaceholder')} className="form-control" rows={4} />
                    <ErrorMessage name="bibtex" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                </fieldset>
                <div className="d-flex justify-content-between mt-4">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => router.push(`/dashboard/publications`)}
                  >
                    <FontAwesomeIcon icon={faXmark} className="me-1" /> {t('cancel')}
                  </Button>
                  <Button variant="success" type="submit" disabled={isSubmitting || isPendingUpdatePublication}>
                    {isSubmitting || isPendingUpdatePublication ? (
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
      )}
    </>
  )
}

export default UpdatePublicationForm;