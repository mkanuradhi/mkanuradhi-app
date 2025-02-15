"use client";
import { useTranslations } from 'next-intl';
import React from 'react'
import { Spinner } from 'react-bootstrap';

const baseTPath = 'components.LoadingContainer';

const LoadingContainer = () => {
  const t = useTranslations(baseTPath);

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center reduced-height-container">
        <h1 className="m-4">{t('loading')}</h1>
        <Spinner animation="border" role="status" className="m-4">
          <span className="visually-hidden">{t('loading')}</span>
        </Spinner>
      </div>
    </>
  )
}

export default LoadingContainer