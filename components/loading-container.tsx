"use client";
import { useTranslations } from 'next-intl';
import React from 'react'
import { Spinner } from 'react-bootstrap';

const baseTPath = 'components.LoadingContainer';

interface LoadingContainerProps {
  message?: string;
}

const LoadingContainer: React.FC<LoadingContainerProps> = ({ message }) => {
  const t = useTranslations(baseTPath);
  message = message || t('loading');

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center reduced-height-container">
        <h4 className="m-4">{message}</h4>
        <Spinner animation="border" role="status" className="m-4">
          <span className="visually-hidden">{t('loading')}</span>
        </Spinner>
      </div>
    </>
  )
}

export default LoadingContainer