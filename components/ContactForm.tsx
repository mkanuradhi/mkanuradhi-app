"use client";
import React, { useRef, useState } from 'react';
import { Button, Col, Container, Form as BootstrapForm, Row } from "react-bootstrap";
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import { ToastContainer, toast } from 'react-toastify';
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import GlowLink from './GlowLink';
import { getNewContactMessageSchema } from '@/schemas/new-contact-message-schema';
import { CreateContactMessageDto } from '@/dtos/contact-dto';
import { useCreateContactMessageMutation } from '@/hooks/use-contact-messages';
import RecaptchaCheckbox, { RecaptchaCheckboxRef } from './recaptcha-checkbox';

const baseTPath = 'components.ContactForm';
const maxMessageLength = 300;

const initialValues = {
  name: '',
  email: '',
  message: '',
}

interface ContactFormProps {
}

const ContactForm: React.FC<ContactFormProps> = ({ }) => {
  const t = useTranslations(baseTPath);
  const { theme } = useTheme();
  const [token, setToken] = useState<string | null>(null);
  const { mutateAsync: createContactMessageMutation, isPending: isPendingCreateContactMessage } = useCreateContactMessageMutation();
  const recaptchaRef = useRef<RecaptchaCheckboxRef>(null);

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    if (!token) {
      toast.error(t('captchaRequired'));
      setSubmitting(false);
      return;
    }

    const contactMessageDto: CreateContactMessageDto = {
      name: values.name,
      email: values.email,
      message: values.message,
      captchaToken: token,
      userAgent: navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    };

    try {
      await createContactMessageMutation(contactMessageDto);
      toast.success(t('successResponse'));
      resetForm();
      setToken(null);
      recaptchaRef.current?.resetRecaptcha();
    } catch (error: any) {
      toast.error(t('errorResponse'));
    } finally {
      setSubmitting(false);
    }

  }

  return (
    <>
      <Container fluid="md">
          <Row>
            <Col>
              <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} position="top-right" />
            </Col>
          </Row>
          <Row className="my-4">
            <Col>
              <h1>{t('title')}</h1>
              <section>
                <p>{t('description')}</p>
              </section>
            </Col>
          </Row>
          <Row className="my-4">
            <Col sm={10} md={8} lg={6} className="mx-auto">
              <Formik
                initialValues={initialValues}
                validationSchema={getNewContactMessageSchema(t)}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values }) => (
                  <Form noValidate>
                    <fieldset disabled={isSubmitting}>
                      <BootstrapForm.Group controlId="formName" className="mb-3">
                        <BootstrapForm.Label>{t('name')}</BootstrapForm.Label>
                        <Field name="name" className="form-control" type="text" placeholder={t('namePlaceholder')} />
                        <ErrorMessage name="name" component="p" className="text-danger" />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group controlId="formEmail" className="mb-3">
                        <BootstrapForm.Label>{t('email')}</BootstrapForm.Label>
                        <Field name="email" className="form-control" type="email" placeholder={t('emailPlaceholder')} />
                        <ErrorMessage name="email" component="p" className="text-danger" />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group controlId="formMessage" className="mb-3">
                        <BootstrapForm.Label>{t('message')}</BootstrapForm.Label>
                        <Field name="message" as="textarea" className="form-control" placeholder={t('messagePlaceholder')} rows={3} />
                        <div className="text-muted text-end small">
                          {values.message.length} / {maxMessageLength}
                        </div>
                        <ErrorMessage name="message" component="p" className="text-danger" />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group controlId="formMessage" className="mb-3">
                        <BootstrapForm.Text id="policy" muted>
                          {t('policyAgree1')} <GlowLink href="/policy" newTab={true} withArrow={true}>{t('policyAgreeLink1')}</GlowLink> {t('policyAgree2')}
                        </BootstrapForm.Text>
                      </BootstrapForm.Group>
                      <BootstrapForm.Group controlId="formCaptcha" className="d-flex justify-content-center mb-3">
                        <RecaptchaCheckbox ref={recaptchaRef} onVerify={setToken} />
                      </BootstrapForm.Group>
                    </fieldset>
                    <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-3">
                      {isSubmitting ? (
                        <>
                          <FontAwesomeIcon icon={faCircleNotch} spin /> {t('submitting')}
                        </>
                      ) : (
                        t('submit')
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Container>
    </>
  )
}

export default ContactForm;