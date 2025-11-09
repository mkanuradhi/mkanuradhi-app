"use client";
import React, { FC, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray, FieldProps } from 'formik';
import { Col, Row, Form as BootstrapForm, Button } from 'react-bootstrap';
import { getNewAwardEnSchema } from '@/schemas/new-award-en-schema';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faMinus, faPaperPlane, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAwardByIdQuery, useUpdateAwardEnMutation } from '@/hooks/use-awards';
import { UpdateAwardEnDto } from '@/dtos/award-dto';
import { useRouter } from '@/i18n/routing';
import Award from '@/interfaces/i-award';
import LoadingContainer from './loading-container';
import RequiredFormLabel from './required-form-label';
import RichTextEditor from './rich-text-editor';
import AwardType from '@/enums/award-type';
import AwardScope from '@/enums/award-scope';
import AwardRole from '@/enums/award-role';
import AwardResult from '@/enums/award-result';
import AwardCategory from '@/enums/award-category';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const baseTPath = 'components.NewAwardEnForm';

interface UpdateAwardEnFormProps {
  id: string;
  onSuccess: (award: Award) => void;
}

const UpdateAwardEnForm: FC<UpdateAwardEnFormProps> = ({ id, onSuccess }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();

  const { data: award, isPending, isError, isFetching, isSuccess, error } = useAwardByIdQuery(id);
  const { mutateAsync: updateAwardEnMutation, isPending: isPendingUpdateAward } = useUpdateAwardEnMutation();

  const initialValues = useMemo(() => {
    return award
      ? {
          year: award.year,
          titleEn: award.titleEn,
          descriptionEn: award.descriptionEn,
          issuerEn: award.issuerEn,
          issuerLocationEn: award.issuerLocationEn,
          ceremonyLocationEn: award.ceremonyLocationEn,
          coRecipientsEn: award.coRecipientsEn,
          receivedDate: award.receivedDate ? new Date(award.receivedDate) : undefined,
          type: award.type,
          scope: award.scope,
          role: award.role,
          result: award.result,
          category: award.category,
          eventUrl: award.eventUrl,
          relatedWorkUrl: award.relatedWorkUrl,
          monetaryValue: award.monetaryValue,
          v: award.v || 0,
        }
      : {
          year: new Date().getFullYear(),
          titleEn: '',
          descriptionEn: '',
          issuerEn: '',
          issuerLocationEn: '',
          ceremonyLocationEn: '',
          coRecipientsEn: [],
          receivedDate: undefined,
          type: AwardType.AWARD,
          scope: AwardScope.UNIVERSITY,
          role: AwardRole.INDIVIDUAL,
          result: AwardResult.WON,
          category: AwardCategory.RESEARCH,
          eventUrl: '',
          relatedWorkUrl: '',
          monetaryValue: '',
          v: 0,
        };
  }, [award]);

  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }  
  ) => {
    const awardEnDto: UpdateAwardEnDto = {
      year: values.year,
      titleEn: values.titleEn,
      descriptionEn: values.descriptionEn,
      issuerEn: values.issuerEn,
      issuerLocationEn: values.issuerLocationEn,
      ceremonyLocationEn: values.ceremonyLocationEn,
      coRecipientsEn: values.coRecipientsEn,
      receivedDate: values.receivedDate ? new Date(values.receivedDate) : new Date(),
      type: values.type,
      scope: values.scope,
      role: values.role,
      result: values.result,
      category: values.category,
      eventUrl: values.eventUrl,
      relatedWorkUrl: values.relatedWorkUrl,
      monetaryValue: values.monetaryValue,
      v: values.v
    };
    
    try {
      const updatedAward = await updateAwardEnMutation({ id, awardEnDto });
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
              validationSchema={getNewAwardEnSchema(t)}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ values, setFieldValue, isSubmitting, status }) => (
                <Form>
                  <fieldset disabled={isSubmitting}>
                    <BootstrapForm.Group className="mb-4" controlId="formYear">
                      <RequiredFormLabel>{t('yearLabel')}</RequiredFormLabel>
                      <Field name="year" type="text" placeholder={t('yearPlaceholder')} className="form-control" />
                      <ErrorMessage name="year" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formTitleEn">
                      <RequiredFormLabel>{t('titleEnLabel')}</RequiredFormLabel>
                      <Field name="titleEn" type="text" placeholder={t('titleEnPlaceholder')} className="form-control" />
                      <ErrorMessage name="titleEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formDescriptionEn">
                      <RequiredFormLabel>{t('descriptionEnLabel')}</RequiredFormLabel>
                      <RichTextEditor
                        value={values.descriptionEn}
                        onChange={(content) => setFieldValue('descriptionEn', content)}
                        placeholder={t('descriptionEnPlaceholder')}
                      />
                      <BootstrapForm.Text className="text-muted">{t('descriptionEnHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="descriptionEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formIssuerEn">
                      <RequiredFormLabel>{t('issuerEnLabel')}</RequiredFormLabel>
                      <Field name="issuerEn" placeholder={t('issuerEnPlaceholder')} className="form-control" />
                      <BootstrapForm.Text className="text-muted">{t('issuerEnHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="issuerEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formIssuerLocationEn">
                      <BootstrapForm.Label>{t('issuerLocationEnLabel')}</BootstrapForm.Label>
                      <Field name="issuerLocationEn" placeholder={t('issuerLocationEnPlaceholder')} className="form-control" />
                      <ErrorMessage name="issuerLocationEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formCeremonyLocationEn">
                      <BootstrapForm.Label>{t('ceremonyLocationEnLabel')}</BootstrapForm.Label>
                      <Field name="ceremonyLocationEn" placeholder={t('ceremonyLocationEnPlaceholder')} className="form-control" />
                      <ErrorMessage name="ceremonyLocationEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formCoRecipientsEn">
                      <BootstrapForm.Label>{t('coRecipientsEnLabel')}</BootstrapForm.Label>
                      <FieldArray name="coRecipientsEn">
                        {({ push, remove }) => (
                          <div>
                            { values.coRecipientsEn && values.coRecipientsEn.length > 0 && 
                              values.coRecipientsEn.map((_, index) => (
                                <div key={index} className="d-flex mb-2 align-items-center">
                                  <Field name={`coRecipientsEn.${index}`} className="form-control me-2" />
                                  <Button variant="danger" type="button" onClick={() => remove(index)} title={t('coRecipientsEnRemove')}>
                                    <FontAwesomeIcon icon={faMinus} />
                                  </Button>
                                </div>
                            ))}
                            <Button variant="primary" type="button" onClick={() => push('')} title={t('coRecipientsEnAdd')}>
                              <FontAwesomeIcon icon={faPlus} />
                            </Button>
                          </div>
                        )}
                      </FieldArray>
                      <BootstrapForm.Text className="text-muted">{t('coRecipientsEnHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="coRecipientsEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formReceivedDate">
                      <BootstrapForm.Label>{t('receivedDateLabel')}</BootstrapForm.Label>
                      <Field name="receivedDate" type="text" className="form-control">
                        {({ field, form }: FieldProps) => (
                          <DatePicker
                            wrapperClassName="w-100"
                            className="form-control"
                            closeOnScroll={true}
                            isClearable={true}
                            showIcon={true}
                            selected={field.value ? new Date(field.value) : null}
                            onChange={date => form.setFieldValue(field.name, date)}
                            dateFormat="dd-MM-yyyy"
                            placeholderText={t('receivedDatePlaceholder')}
                            icon={<i className="bi bi-calendar2-check-fill"></i>}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="receivedDate" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formType">
                      <RequiredFormLabel>{t('typeLabel')}</RequiredFormLabel>
                      <Field as="select" name="type" className="form-select">
                        {Object.values(AwardType).map((type) => (
                          <option key={type} value={type}>
                            {t(`awardType.${type}`)}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="type" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formScope">
                      <RequiredFormLabel>{t('scopeLabel')}</RequiredFormLabel>
                      <Field as="select" name="scope" className="form-select">
                        {Object.values(AwardScope).map((scope) => (
                          <option key={scope} value={scope}>
                            {t(`awardScope.${scope}`)}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="scope" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formRole">
                      <RequiredFormLabel>{t('roleLabel')}</RequiredFormLabel>
                      <Field as="select" name="role" className="form-select">
                        {Object.values(AwardRole).map((role) => (
                          <option key={role} value={role}>
                            {t(`awardRole.${role}`)}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="role" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formResult">
                      <RequiredFormLabel>{t('resultLabel')}</RequiredFormLabel>
                      <Field as="select" name="result" className="form-select">
                        {Object.values(AwardResult).map((result) => (
                          <option key={result} value={result}>
                            {t(`awardResult.${result}`)}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="result" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formCategory">
                      <RequiredFormLabel>{t('categoryLabel')}</RequiredFormLabel>
                      <Field as="select" name="category" className="form-select">
                        {Object.values(AwardCategory).map((category) => (
                          <option key={category} value={category}>
                            {t(`awardCategory.${category}`)}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="category" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formEventUrl">
                      <BootstrapForm.Label>{t('eventUrlLabel')}</BootstrapForm.Label>
                      <Field name="eventUrl" type="url" placeholder={t('eventUrlPlaceholder')} className="form-control" />
                      <BootstrapForm.Text className="text-muted">{t('eventUrlHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="eventUrl" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formRelatedWorkUrl">
                      <BootstrapForm.Label>{t('relatedWorkUrlLabel')}</BootstrapForm.Label>
                      <Field name="relatedWorkUrl" type="url" placeholder={t('relatedWorkUrlPlaceholder')} className="form-control" />
                      <BootstrapForm.Text className="text-muted">{t('relatedWorkUrlHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="relatedWorkUrl" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formMonetaryValue">
                      <BootstrapForm.Label>{t('monetaryValueLabel')}</BootstrapForm.Label>
                      <Field name="monetaryValue" placeholder={t('monetaryValuePlaceholder')} className="form-control" />
                      <BootstrapForm.Text className="text-muted">{t('monetaryValueHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="monetaryValue" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                  </fieldset>
                  <div className="d-flex justify-content-between mt-4">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => router.push('/dashboard/awards')}
                    >
                      <FontAwesomeIcon icon={faXmark} className="me-1" /> {t('cancel')}
                    </Button>
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

export default UpdateAwardEnForm;