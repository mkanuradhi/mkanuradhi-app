"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ActiveStep from '@/enums/active-step';
import { usePublicationByIdQuery } from '@/hooks/use-publications';
import Publication from '@/interfaces/i-publication';
import UpdatePublicationForm from './update-publication-form';


const baseTPath = 'components.UpdatePublicationFormsContainer';

interface UpdatePublicationFormsContainerProps {
  publicationId: string;
}

const UpdatePublicationFormsContainer:React.FC<UpdatePublicationFormsContainerProps> = ({ publicationId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as ActiveStep | null;
  const t = useTranslations(baseTPath);

  const { data: publication, isError, error } = usePublicationByIdQuery(publicationId);
  const [step, setStep] = useState<ActiveStep>(stepParam || ActiveStep.GENERAL);

  const stepLabels: Partial<Record<ActiveStep, string>> = {
    [ActiveStep.GENERAL]: t('stepGeneral'),
  };

  const handleSubmit = (updatedPublication: Publication) => {
    router.push(`/dashboard/publications/${publicationId}`);
  };

  if (isError && error) {
    return (
      <Row className="my-3">
        <Col>
          <h4>{t('failPublication')}</h4>
          <p>{error.message}</p>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <Row className="my-3">
        <Col>
          <h4>{stepLabels[step]}</h4>
        </Col>
      </Row>             
      <Row>
        <Col>
          { step === ActiveStep.GENERAL && publication && (
            <UpdatePublicationForm publicationId={publicationId} onSuccess={handleSubmit} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default UpdatePublicationFormsContainer;