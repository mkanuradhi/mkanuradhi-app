"use client";
import React, { FC } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Col, Row, Form as BootstrapForm, Button } from 'react-bootstrap';
import { getNewCourseEnSchema } from '@/schemas/new-course-en-schema';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faLaptop, faPaperPlane, faUser, faUsers, faXmark } from '@fortawesome/free-solid-svg-icons';
import Course from '@/interfaces/i-course';
import { useRouter } from '@/i18n/routing';
import { useCreateCourseEnMutation } from '@/hooks/use-courses';
import { CreateCourseEnDto } from '@/dtos/course-dto';
import DeliveryMode from '@/enums/delivery-mode';
import RequiredFormLabel from './required-form-label';
import RichTextEditor from './rich-text-editor';

const baseTPath = 'components.NewCourseEnForm';

const initialValues = {
  year: new Date().getFullYear(),
  code: '',
  credits: undefined,
  mode: DeliveryMode.PHYSICAL,
  titleEn: '',
  subtitleEn: '',
  descriptionEn: '',
  locationEn: '',
}

interface NewCourseEnFormProps {
  onSuccess: (course: Course) => void;
}

const NewCourseEnForm: FC<NewCourseEnFormProps> = ({ onSuccess }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();
  const { mutateAsync: createCourseEnMutation, isPending: isPendingCreateCourse } = useCreateCourseEnMutation();

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
    const courseEnDto: CreateCourseEnDto = {
      year: values.year,
      code: values.code,
      credits: values.credits,
      mode: values.mode,
      titleEn: values.titleEn,
      subtitleEn: values.subtitleEn,
      descriptionEn: values.descriptionEn,
      locationEn: values.locationEn,
    };
    
    try {
      const createdCourse = await createCourseEnMutation(courseEnDto);
      // Call parent's onSuccess with the created id
      onSuccess(createdCourse);
    } catch (error: any) {
      // Set a generic error message
      actions.setStatus({ error: error.message || "Failed to create course." });
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
            validationSchema={getNewCourseEnSchema(t)}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting, status }) => (
              <Form>
                <fieldset disabled={isSubmitting}>
                  <BootstrapForm.Group className="mb-4" controlId="formYear">
                    <RequiredFormLabel>{t('yearLabel')}</RequiredFormLabel>
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
                    <RequiredFormLabel>{t('modeLabel')}</RequiredFormLabel>
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
                    <RequiredFormLabel>{t('titleEnLabel')}</RequiredFormLabel>
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
                    <RichTextEditor
                      value={values.descriptionEn}
                      onChange={(content) => setFieldValue('descriptionEn', content)}
                      placeholder={t('descriptionEnPlaceholder')}
                    />
                    <BootstrapForm.Text className="text-muted">{t('descriptionEnHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="descriptionEn" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formLocationEn">
                    <RequiredFormLabel>{t('locationEnLabel')}</RequiredFormLabel>
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
                  <Button variant="success" type="submit" disabled={isSubmitting || isPendingCreateCourse}>
                    {isSubmitting || isPendingCreateCourse ? (
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
    </>
  )
}

export default NewCourseEnForm;