"use client";
import React, { FC, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray, FieldProps } from 'formik';
import { Col, Row, Form as BootstrapForm, Button } from 'react-bootstrap';
import { getNewCourseEnSchema } from '@/schemas/new-course-en-schema';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faLaptop, faPaperPlane, faUser, faUsers, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useCourseByIdQuery, useUpdateCourseEnMutation } from '@/hooks/use-courses';
import { UpdateCourseEnDto } from '@/dtos/course-dto';
import { useRouter } from '@/i18n/routing';
import 'react-datepicker/dist/react-datepicker.css';
import Course from '@/interfaces/i-course';
import LoadingContainer from './loading-container';
import DeliveryMode from '@/enums/delivery-mode';

const baseTPath = 'components.NewCourseEnForm';

interface UpdateCourseEnFormProps {
  id: string;
  onSuccess: (course: Course) => void;
}

const UpdateCourseEnForm: FC<UpdateCourseEnFormProps> = ({ id, onSuccess }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();

  const { data: course, isPending, isError, isFetching, isSuccess, error } = useCourseByIdQuery(id);
  const { mutateAsync: updateCourseEnMutation, isPending: isPendingUpdateCourse } = useUpdateCourseEnMutation();

  const initialValues = useMemo(() => {
    return course
      ? {
          year: course.year,
          code: course.code,
          credits: course.credits,
          mode: course.mode || DeliveryMode.PHYSICAL,
          titleEn: course.titleEn || '',
          subtitleEn: course.subtitleEn || '',
          descriptionEn: course.descriptionEn || '',
          locationEn: course.locationEn || '',
          v: course.v || 0,
        }
      : {
          year: new Date().getFullYear(),
          code: '',
          credits: undefined,
          mode: DeliveryMode.PHYSICAL,
          titleEn: '',
          subtitleEn: '',
          descriptionEn: '',
          locationEn: '',
          v: 0,
        };
  }, [course]);

  const modeHelpData = {
      [DeliveryMode.PHYSICAL]: {
        text: t('modePhysical'),
        icon: <FontAwesomeIcon icon={faUsers} className="text-success" />,
      },
      [DeliveryMode.ONLINE]: {
        text: t('modeOnline'),
        icon: (
          <span className="fa-layers fa-fw me-2">
            <FontAwesomeIcon icon={faUsers} className="fa-layers-back text-danger" transform="shrink-8" />
            <FontAwesomeIcon icon={faLaptop} className="fa-layers-front text-secondary" transform="grow-4" />
          </span>
        ),
      },
      [DeliveryMode.HYBRID]: {
        text: t('modeHybrid'),
        icon: (
          <span className="fa-layers fa-fw ms-2 me-2">
            <FontAwesomeIcon icon={faUsers} className="fa-layers-back text-success" transform="shrink-1 left-12" />
            <FontAwesomeIcon icon={faUser} className="fa-layers-back text-danger" transform="shrink-8 right-10" />
            <FontAwesomeIcon icon={faLaptop} className="fa-layers-front text-secondary" transform="grow-4 right-10" />
          </span>
        ),
      },
    };

  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }  
  ) => {
    const courseEnDto: UpdateCourseEnDto = {
      year: values.year,
      code: values.code,
      credits: values.credits,
      mode: values.mode,
      titleEn: values.titleEn,
      subtitleEn: values.subtitleEn,
      descriptionEn: values.descriptionEn,
      locationEn: values.locationEn,
      v: values.v
    };
    
    try {
      const updatedCourse = await updateCourseEnMutation({ id, courseEnDto });
      // Call parent's onSuccess
      onSuccess(updatedCourse);
    } catch (error: any) {
      // Set a generic error message
      actions.setStatus({ error: error.message || "Failed to update course." });
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
      {isSuccess && course && (
        <Row>
          <Col>
            <Formik
              initialValues={initialValues}
              validationSchema={getNewCourseEnSchema(t)}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ values, isSubmitting, status }) => (
                <Form>
                  <fieldset disabled={isSubmitting}>
                    <BootstrapForm.Group className="mb-4" controlId="formYear">
                      <BootstrapForm.Label>{t('yearLabel')}</BootstrapForm.Label>
                      <Field name="year" type="text" placeholder={t('yearPlaceholder')} className="form-control" />
                      <ErrorMessage name="year" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formCode">
                      <BootstrapForm.Label>{t('codeLabel')}</BootstrapForm.Label>
                      <Field name="code" type="text" placeholder={t('codePlaceholder')} className="form-control" />
                      <ErrorMessage name="code" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formCredits">
                      <BootstrapForm.Label>{t('creditsLabel')}</BootstrapForm.Label>
                      <Field name="credits" type="text" placeholder={t('creditsPlaceholder')} className="form-control" />
                      <ErrorMessage name="credits" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formMode">
                      <BootstrapForm.Label>{t('modeLabel')}</BootstrapForm.Label>
                      <Field as="select" name="mode" className="form-select">
                        {Object.values(DeliveryMode).map((mode) => (
                          <option key={mode} value={mode}>
                            {t(`deliveryMode.${mode}`)}
                          </option>
                        ))}
                      </Field>
                      {values.mode && (
                        <BootstrapForm.Text className="text-muted">
                          {modeHelpData[values.mode].icon}
                          <span className="ms-2">{modeHelpData[values.mode].text}</span>
                        </BootstrapForm.Text>
                      )}
                      <ErrorMessage name="mode" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formTitleEn">
                      <BootstrapForm.Label>{t('titleEnLabel')}</BootstrapForm.Label>
                      <Field name="titleEn" type="text" placeholder={t('titleEnPlaceholder')} className="form-control" />
                      <ErrorMessage name="titleEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formSubtitleEn">
                      <BootstrapForm.Label>{t('subtitleEnLabel')}</BootstrapForm.Label>
                      <Field name="subtitleEn" placeholder={t('subtitleEnPlaceholder')} className="form-control" />
                      <ErrorMessage name="subtitleEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formDescriptionEn">
                      <BootstrapForm.Label>{t('descriptionEnLabel')}</BootstrapForm.Label>
                      <Field as="textarea" name="descriptionEn" placeholder={t('descriptionEnPlaceholder')} className="form-control" rows={8} />
                      <BootstrapForm.Text className="text-muted">{t('descriptionEnHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="descriptionEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formLocationEn">
                      <BootstrapForm.Label>{t('locationEnLabel')}</BootstrapForm.Label>
                      <Field name="locationEn" placeholder={t('locationEnPlaceholder')} className="form-control" />
                      <BootstrapForm.Text className="text-muted">{t('locationEnHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="locationEn" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                  </fieldset>
                  <div className="d-flex justify-content-between mt-4">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => router.push('/dashboard/courses')}
                    >
                      <FontAwesomeIcon icon={faXmark} className="me-1" /> {t('cancel')}
                    </Button>
                    <Button variant="success" type="submit" disabled={isSubmitting || isPendingUpdateCourse}>
                      {isSubmitting || isPendingUpdateCourse ? (
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

export default UpdateCourseEnForm;