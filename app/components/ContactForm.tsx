"use client";
import React from 'react';
import { Button, Col, Container, Form as BootstrapForm, Row } from "react-bootstrap";
import { useTheme } from '@/app/hooks/useTheme';
import { useTranslations } from 'next-intl';
import { ToastContainer, toast } from 'react-toastify';
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

const baseTPath = 'pages.Contact';

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
}

const ContactForm: React.FC<ContactFormProps> = ({ }) => {
  const t = useTranslations(baseTPath);
  const { theme } = useTheme();

  const contactValidationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[\p{L}\p{M}\s'-]+$/u, t('invalidName'))
      .max(40, t('tooLongName'))
      .required(t('requiredName')),
    email: Yup.string()
      .email(t('invalidEmail'))
      .required(t('requiredEmail')),
    message: Yup.string()
      .max(300, t('tooLongMessage'))
      .required(t('requiredMessage')),
  });

  const handleSubmit = async (values: ContactFormValues, { setSubmitting, resetForm }: FormikHelpers<ContactFormValues>) => {
    try {
      const name = values.name?.toString().trim();
      const email = values.email?.toString().trim();
      const message = values.message?.toString().trim();

      const notifyUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${process.env.NEXT_PUBLIC_NOTIFY_PATH}`;
      const response = await fetch(notifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (response.ok) {
        toast.success(t('successResponse'));
        resetForm();
      } else {
        toast.error(t('errorResponse'));
      }
    } catch (error) {
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
                initialValues={{ name: '', email: '', message: '' }}
                validationSchema={contactValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form noValidate>
                    <fieldset disabled={isSubmitting}>
                      <BootstrapForm.Group controlId="formName" className="mb-4">
                        <BootstrapForm.Label>{t('name')}</BootstrapForm.Label>
                        <Field name="name" className="form-control" type="text" placeholder={t('namePlaceholder')} />
                        <ErrorMessage name="name" component="p" className="text-danger" />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group controlId="formEmail" className="mb-4">
                        <BootstrapForm.Label>{t('email')}</BootstrapForm.Label>
                        <Field name="email" className="form-control" type="email" placeholder={t('emailPlaceholder')} />
                        <ErrorMessage name="email" component="p" className="text-danger" />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group controlId="formMessage" className="mb-4">
                        <BootstrapForm.Label>{t('message')}</BootstrapForm.Label>
                        <Field name="message" as="textarea" className="form-control" placeholder={t('messagePlaceholder')} rows={3} />
                        <ErrorMessage name="message" component="p" className="text-danger" />
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