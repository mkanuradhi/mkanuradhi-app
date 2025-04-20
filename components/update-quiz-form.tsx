"use client";
import React, { useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import { Col, Row, Form as BootstrapForm, Button, InputGroup } from 'react-bootstrap';
import { getNewQuizSchema } from '@/schemas/new-quiz-schema';
import { useLocale, useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import { useQuizByIdQuery, useUpdateQuizMutation } from '@/hooks/use-quizzes';
import { useRouter } from '@/i18n/routing';
import 'react-datepicker/dist/react-datepicker.css';
import RequiredFormLabel from './required-form-label';
import Quiz from '@/interfaces/i-quiz';
import { UpdateQuizDto } from '@/dtos/quiz-dto';
import { LANG_EN, LANG_SI } from '@/constants/common-vars';
import LoadingContainer from './loading-container';


const baseTPath = 'components.NewQuizForm';

interface UpdateQuizFormProps {
  courseId: string;
  quizId: string;
  v: number;
  onSuccess: (quiz: Quiz) => void;
}

const UpdateQuizForm: React.FC<UpdateQuizFormProps> = ({ courseId, quizId, onSuccess }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();
  const lang = useLocale();

  const { data: quiz, isPending, isError, isFetching, isSuccess, error } = useQuizByIdQuery(courseId, quizId);
  const { mutateAsync: updateQuizMutation, isPending: isPendingUpdateQuiz } = useUpdateQuizMutation();

  const initialValues = useMemo(() => {
      return quiz
        ? {
            titleEn: quiz.titleEn || '',
            titleSi: quiz.titleSi || '',
            duration: quiz.duration || '',
            availableFrom: quiz.availableFrom || undefined,
            availableUntil: quiz.availableUntil || undefined,
            v: quiz.v || 0,
          }
        : {
            titleEn: '',
            titleSi: '',
            duration: '',
            availableFrom: undefined,
            availableUntil: undefined,
            v: 0,
          };
    }, [quiz]);

  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }  
  ) => {
    const quizDto: UpdateQuizDto = {
      titleEn: values.titleEn,
      titleSi: values.titleSi,
      duration: values.duration === '' ? undefined : Number(values.duration),
      availableFrom: values.availableFrom,
      availableUntil: values.availableUntil,
      v: values.v,
    };
    
    try {
      const updatedQuiz = await updateQuizMutation({courseId, quizId, quizDto});
      // Call parent's onSuccess with the created id
      onSuccess(updatedQuiz);
    } catch (error: any) {
      // Set a generic error message
      actions.setStatus({ error: error.message || "Failed to update quiz." });
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
      {isSuccess && quiz && (
      <Row>
        <Col>
          <Formik
            initialValues={initialValues}
            validationSchema={getNewQuizSchema(t)}
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
                  <BootstrapForm.Group className="mb-4" controlId="formTitleSi">
                    <RequiredFormLabel>{t('titleSiLabel')}</RequiredFormLabel>
                    <Field name="titleSi" type="text" placeholder={t('titleSiPlaceholder')} className="form-control" />
                    <ErrorMessage name="titleSi" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formDuration">
                    <BootstrapForm.Label>{t('durationLabel')}</BootstrapForm.Label>
                    <Field name="duration">
                      {({ field }: FieldProps) => (
                        <InputGroup>
                          {lang === LANG_SI && <InputGroup.Text>{t('durationMinutes')}</InputGroup.Text>}
                          <BootstrapForm.Control
                            {...field}
                            type="text"
                            placeholder={t('durationPlaceholder')}
                          />
                          {lang === LANG_EN && <InputGroup.Text>{t('durationMinutes')}</InputGroup.Text>}
                        </InputGroup>
                      )}
                    </Field>
                    <BootstrapForm.Text className="text-muted">{t('durationHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="duration" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formAvailableFrom">
                    <BootstrapForm.Label>{t('availableFromLabel')}</BootstrapForm.Label>
                    <Field name="availableFrom" type="text" className="form-control">
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
                          timeInputLabel={t('availableFromInputLabel')}
                          showTimeInput={true}
                          placeholderText={t('availableFromPlaceholder')}
                          icon={<i className="bi bi-calendar2-check-fill"></i>}

                        />
                      )}
                    </Field>
                    <ErrorMessage name="availableFrom" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formAvailableUntil">
                    <BootstrapForm.Label>{t('availableUntilLabel')}</BootstrapForm.Label>
                    <Field name="availableUntil" type="text" className="form-control">
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
                          timeInputLabel={t('availableUntilInputLabel')}
                          showTimeInput={true}
                          placeholderText={t('availableUntilPlaceholder')}
                          icon={<i className="bi bi-calendar2-check-fill"></i>}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="availableUntil" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                </fieldset>
                <div className="d-flex justify-content-between mt-4">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => router.push(`/dashboard/courses/${courseId}/quizzes`)}
                  >
                    <FontAwesomeIcon icon={faXmark} className="me-1" /> {t('cancel')}
                  </Button>
                  <Button variant="success" type="submit" disabled={isSubmitting || isPendingUpdateQuiz}>
                    {isSubmitting || isPendingUpdateQuiz ? (
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

export default UpdateQuizForm;