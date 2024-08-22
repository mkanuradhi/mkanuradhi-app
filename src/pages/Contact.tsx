import { useTranslation } from "react-i18next";
import MetaTags from "../components/MetaTags";
import anuImage from "../assets/images/anuradha.png";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { FormEvent, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useTheme from "../hooks/useTheme";

export const Contact = () => {
  const { t } = useTranslation('', { keyPrefix: 'pages.Contact' });
  const form = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState<boolean>(false);
  const { theme } = useTheme();

  const notifyMessage = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);

    if (form.current) {
      const formData = new FormData(form.current);
      const values = Object.fromEntries(formData.entries());

      const name = values.name?.toString().trim();
      const email = values.email?.toString().trim();
      const message = values.message?.toString().trim();

      if (validateInputs(name, email, message)) {
        try {
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
            form.current.reset();
          } else {
            toast.error(t('errorResponse'));
          }
        } catch (error) {
          toast.error(t('errorResponse'));
        } finally {
          setSending(false);
        }
      } else {
        setSending(false);
      }
    } else {
      setSending(false);
    }
  }

  const validateInputs = (name: string, email: string, message: string) => {
    name = name?.toString().trim();
    email = email?.toString().trim();
    message = message?.toString().trim();

    if (!name || name.length < 3) {
      setSending(false);
      toast.warning(t('invalidName'));
      return false;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setSending(false);
      toast.warning(t('invalidEmail'));
      return false;
    }

    if (!message || message.length < 4) {
      setSending(false);
      toast.warning(t('invalidMessage'));
      return false;
    }

    return true;
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
              <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} position="bottom-center" />
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
              <Form ref={form} onSubmit={notifyMessage} noValidate>
                <fieldset disabled={sending}>
                  <Form.Group className="mb-3" controlId="formGroupName">
                    <Form.Label>{t('name')}</Form.Label>
                    <Form.Control type="text" name="name" placeholder={t('namePlaceholder')} className="rounded-pill" required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control type="email" name="email" placeholder={t('emailPlaceholder')} className="rounded-pill" required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGroupMessage">
                    <Form.Label>{t('message')}</Form.Label>
                    <Form.Control as="textarea" name="message" rows={4} placeholder={t('messagePlaceholder')} className="rounded-4" required />
                  </Form.Group>
                  <Button type="submit" className="rounded-pill">
                    {sending && (
                    t('submitting')
                    )}
                    {!sending && (
                      t('submit')
                    )}
                  </Button>
                </fieldset>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
