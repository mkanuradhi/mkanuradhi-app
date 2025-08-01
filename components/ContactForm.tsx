"use client";
import React from 'react';
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

const baseTPath = 'components.ContactForm';

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
  const { mutateAsync: createContactMessageMutation, isPending: isPendingCreateContactMessage } = useCreateContactMessageMutation();

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: FormikHelpers<typeof initialValues>
  ) => {

    const contactMessageDto: CreateContactMessageDto = {
      name: values.name,
      email: values.email,
      message: values.message,
    };

    try {
      await createContactMessageMutation(contactMessageDto);
      toast.success(t('successResponse'));
      resetForm();
      // Call parent's onSuccess with the created id
      // onSuccess(createdPublication);
    } catch (error: any) {
      toast.error(t('errorResponse'));
    } finally {
      setSubmitting(false);
    }

    // try {
    //   const name = values.name?.toString().trim();
    //   const email = values.email?.toString().trim();
    //   const message = values.message?.toString().trim();

    //   const notifyUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${process.env.NEXT_PUBLIC_NOTIFY_PATH}`;
    //   const response = await fetch(notifyUrl, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       name,
    //       email,
    //       message,
    //     }),
    //   });

    //   if (response.ok) {
    //     toast.success(t('successResponse'));
    //     resetForm();
    //   } else {
    //     toast.error(t('errorResponse'));
    //   }
    // } catch (error) {
    //   toast.error(t('errorResponse'));
    // } finally {
    //   setSubmitting(false);
    // }
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
                      <BootstrapForm.Group controlId="formMessage" className="mb-4">
                        <BootstrapForm.Text id="policy" muted>
                          {t('policyAgree1')} <GlowLink href="/policy" newTab={true} withArrow={true}>{t('policyAgreeLink1')}</GlowLink> {t('policyAgree2')}
                        </BootstrapForm.Text>
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