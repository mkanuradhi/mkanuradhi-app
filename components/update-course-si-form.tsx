"use client";
import React, { FC, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Col, Row, Form as BootstrapForm, Button } from 'react-bootstrap';
import { getUpdateCourseSiSchema } from '@/schemas/update-course-si-schema';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useCourseByIdQuery, useUpdateCourseSiMutation } from '@/hooks/use-courses';
import { UpdateCourseSiDto } from '@/dtos/course-dto';
import Course from '@/interfaces/i-course';
import LoadingContainer from './loading-container';
import RequiredFormLabel from './required-form-label';
import RichTextEditor from './rich-text-editor';

const baseTPath = 'components.UpdateCourseSiForm';

interface UpdateCourseSiFormProps {
  id: string;
  v: number;
  onSuccess: (course: Course) => void;
}

const UpdateCourseSiForm: FC<UpdateCourseSiFormProps> = ({id, onSuccess }) => {
  const t = useTranslations(baseTPath);

  const { data: course, isPending, isError, isFetching, isSuccess, error } = useCourseByIdQuery(id);
  const { mutateAsync: updateCourseSiMutation, isPending: isPendingUpdateCourse } = useUpdateCourseSiMutation();

  const initialValues = useMemo(() => {
    return course
      ? {
          titleSi: course.titleSi || '',
          subtitleSi: course.subtitleSi || '',
          descriptionSi: course.descriptionSi || '',
          locationSi: course.locationSi || '',
          v: course.v || 0,
        }
      : {
          titleSi: '',
          subtitleSi: '',
          descriptionSi: '',
          locationSi: '',
          v: 0,
        };
  }, [course]);

  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }  
  ) => {
    const courseSiDto: UpdateCourseSiDto = {
      titleSi: values.titleSi,
      subtitleSi: values.subtitleSi,
      descriptionSi: values.descriptionSi,
      locationSi: values.locationSi,
      v: values.v,
    };
    
    try {
      const updatedCourse = await updateCourseSiMutation({ id, courseSiDto });
      // Call parent's onSuccess with the created id
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
              validationSchema={getUpdateCourseSiSchema(t)}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ values, setFieldValue, isSubmitting, status }) => (
                <Form>
                  <fieldset disabled={isSubmitting}>
                    <BootstrapForm.Group className="mb-4" controlId="formTitleSi">
                      <RequiredFormLabel>{t('titleSiLabel')}</RequiredFormLabel>
                      <Field name="titleSi" type="text" placeholder={t('titleSiPlaceholder')} className="form-control" />
                      <ErrorMessage name="titleSi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formSubtitleSi">
                      <BootstrapForm.Label>{t('subtitleSiLabel')}</BootstrapForm.Label>
                      <Field name="subtitleSi" placeholder={t('subtitleSiPlaceholder')} className="form-control" />
                      <BootstrapForm.Text className="text-muted">{t('subtitleSiHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="subtitleSi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formDescriptionSi">
                      <BootstrapForm.Label>{t('descriptionSiLabel')}</BootstrapForm.Label>
                      <RichTextEditor
                        value={values.descriptionSi}
                        onChange={(content) => setFieldValue('descriptionSi', content)}
                        placeholder={t('descriptionSiPlaceholder')}
                      />
                      <BootstrapForm.Text className="text-muted">{t('descriptionSiHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="descriptionSi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-4" controlId="formLocationSi">
                      <RequiredFormLabel>{t('locationSiLabel')}</RequiredFormLabel>
                      <Field name="locationSi" placeholder={t('locationSiPlaceholder')} className="form-control" />
                      <BootstrapForm.Text className="text-muted">{t('locationSiHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="locationSi" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                  </fieldset>
                  <div className="d-flex justify-content-end mt-4">
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

export default UpdateCourseSiForm;