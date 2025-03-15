"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const baseTPath = 'pages.Error';

interface ErrorPageProps {
  error: Error & { digest?: string },
  reset: () => void,
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  const t = useTranslations(baseTPath);

  useEffect(() => {
    console.error(error)
  }, [error])
  
  return (
    <>
      <Container fluid="md">
        <Row>
          <Col>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 'calc(100svh - 4.5rem - 4.5rem)' }}>
              <h1 className="my-3">{t('title')}</h1>
              <h5 className="my-3">{t('subTitle')}</h5>
              <FontAwesomeIcon icon={faCircleExclamation} style={{ height: '72px' }} className="my-3" />
              <p className="my-3">{ error.message }</p>
              <p className="my-3">Hash: <span className="text-muted">{ error.digest }</span></p>
              <Button onClick={ () => reset() }>{t('tryAgain')}</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default ErrorPage;
