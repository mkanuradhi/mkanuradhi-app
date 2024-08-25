import { useTranslation } from "react-i18next";
import MetaTags from "../components/MetaTags";
import anuImage from "../assets/images/anuradha.png";
import { Button, Col, Container, Form as BootstrapForm, Row } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "../hooks/useTheme";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export const Contact = () => {
  const { t } = useTranslation('', { keyPrefix: 'pages.Contact' });
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

      const notifyUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_NOTIFY_PATH}`;
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
      <MetaTags
        title={t('title')}
        subTitle={t('subTitle')}
        description={t('description')} 
        image={anuImage}
      />
      <div className="contact">
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
                      {t('submit')}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
