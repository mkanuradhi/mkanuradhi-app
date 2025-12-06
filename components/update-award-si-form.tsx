"use client";
import React, { FC, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { Col, Row, Form as BootstrapForm, Button, Accordion, Badge } from 'react-bootstrap';
import { getUpdateAwardSiSchema } from '@/schemas/update-award-si-schema';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faMinus, faPaperPlane, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAwardByIdQuery, useUpdateAwardSiMutation } from '@/hooks/use-awards';
import { UpdateAwardSiDto } from '@/dtos/award-dto';
import { useRouter } from '@/i18n/routing';
import Award from '@/interfaces/i-award';
import LoadingContainer from './loading-container';
import RequiredFormLabel from './required-form-label';
import RichTextEditor from './rich-text-editor';
import EnReferenceAccordion from './en-reference-accordion';
import 'react-datepicker/dist/react-datepicker.css';

const baseTPath = 'components.UpdateAwardSiForm';

interface UpdateAwardSiFormProps {
  id: string;
  v: number;
  onSuccess: (award: Award) => void;
}

const UpdateAwardSiForm: FC<UpdateAwardSiFormProps> = ({ id, onSuccess }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();

  const { data: award, isPending, isError, isFetching, isSuccess, error } = useAwardByIdQuery(id);
  const { mutateAsync: updateAwardSiMutation, isPending: isPendingUpdateAward } = useUpdateAwardSiMutation();

  const initialValues = useMemo(() => {
    return award
      ? {
          titleSi: award.titleSi,
          descriptionSi: award.descriptionSi,
          issuerSi: award.issuerSi,
          issuerLocationSi: award.issuerLocationSi,
          ceremonyLocationSi: award.ceremonyLocationSi,
          coRecipientsSi: award.coRecipientsSi,
          v: award.v || 0,
        }
      : {
          titleSi: '',
          descriptionSi: '',
          issuerSi: '',
          issuerLocationSi: '',
          ceremonyLocationSi: '',
          coRecipientsSi: [],
          v: 0,
        };
  }, [award]);

  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }  
  ) => {
    const awardSiDto: UpdateAwardSiDto = {
      titleSi: values.titleSi,
      descriptionSi: values.descriptionSi,
      issuerSi: values.issuerSi,
      issuerLocationSi: values.issuerLocationSi,
      ceremonyLocationSi: values.ceremonyLocationSi,
      coRecipientsSi: values.coRecipientsSi,
      v: values.v
    };
    
    try {
      const updatedAward = await updateAwardSiMutation({ id, awardSiDto });
      // Call parent's onSuccess
      onSuccess(updatedAward);
    } catch (error: any) {
      // Set a generic error message
      actions.setStatus({ error: error.message || "Failed to update award." });
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
      {isSuccess && award && (
        <Row>
          <Col>
            <Formik
              initialValues={initialValues}
              validationSchema={getUpdateAwardSiSchema(t)}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ values, setFieldValue, isSubmitting, status }) => (
                <Form>
                  <fieldset disabled={isSubmitting}>
                    <BootstrapForm.Group className="mb-4" controlId="formTitleSi">
                      <RequiredFormLabel>{t('titleSiLabel')}</RequiredFormLabel>
                      <EnReferenceAccordion content={award.titleEn} />
                      <Field name="titleSi" type="text" placeholder={t('titleSiPlaceholder')} className="form-control" />
                      <ErrorMessage name="titleSi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formDescriptionSi">
                      <RequiredFormLabel>{t('descriptionSiLabel')}</RequiredFormLabel>
                      <EnReferenceAccordion content={award.descriptionEn} isHtml={true} />
                      <RichTextEditor
                        value={values.descriptionSi}
                        onChange={(content) => setFieldValue('descriptionSi', content)}
                        placeholder={t('descriptionSiPlaceholder')}
                      />
                      <BootstrapForm.Text className="text-muted">{t('descriptionSiHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="descriptionSi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formIssuerSi">
                      <RequiredFormLabel>{t('issuerSiLabel')}</RequiredFormLabel>
                      <EnReferenceAccordion content={award.issuerEn} />
                      <Field name="issuerSi" placeholder={t('issuerSiPlaceholder')} className="form-control" />
                      <BootstrapForm.Text className="text-muted">{t('issuerSiHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="issuerSi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formIssuerLocationSi">
                      <BootstrapForm.Label>{t('issuerLocationSiLabel')}</BootstrapForm.Label>
                      <EnReferenceAccordion content={award.issuerLocationEn} />
                      <Field name="issuerLocationSi" placeholder={t('issuerLocationSiPlaceholder')} className="form-control" />
                      <ErrorMessage name="issuerLocationSi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formCeremonyLocationSi">
                      <BootstrapForm.Label>{t('ceremonyLocationSiLabel')}</BootstrapForm.Label>
                      <EnReferenceAccordion content={award.ceremonyLocationEn} />
                      <Field name="ceremonyLocationSi" placeholder={t('ceremonyLocationSiPlaceholder')} className="form-control" />
                      <ErrorMessage name="ceremonyLocationSi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formCoRecipientsSi">
                      <BootstrapForm.Label>{t('coRecipientsSiLabel')}</BootstrapForm.Label>
                      {award.coRecipientsEn && award.coRecipientsEn.length > 0 && (
                        <EnReferenceAccordion content={award.coRecipientsEn.join(', ')} />
                      )}
                      <FieldArray name="coRecipientsSi">
                        {({ push, remove }) => (
                          <div>
                            { values.coRecipientsSi && values.coRecipientsSi.length > 0 && 
                              values.coRecipientsSi.map((_, index) => (
                                <div key={index} className="d-flex mb-2 align-items-center">
                                  <Field name={`coRecipientsSi.${index}`} className="form-control me-2" />
                                  <Button variant="danger" type="button" onClick={() => remove(index)} title={t('coRecipientsSiRemove')}>
                                    <FontAwesomeIcon icon={faMinus} />
                                  </Button>
                                </div>
                            ))}
                            <Button variant="primary" type="button" onClick={() => push('')} title={t('coRecipientsSiAdd')}>
                              <FontAwesomeIcon icon={faPlus} />
                            </Button>
                          </div>
                        )}
                      </FieldArray>
                      <BootstrapForm.Text className="text-muted">{t('coRecipientsSiHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="coRecipientsSi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                  </fieldset>
                  <div className="d-flex justify-content-end mt-4">
                    <Button variant="success" type="submit" disabled={isSubmitting || isPendingUpdateAward}>
                      {isSubmitting || isPendingUpdateAward ? (
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

export default UpdateAwardSiForm;