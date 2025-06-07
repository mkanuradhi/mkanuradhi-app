"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ActiveStep from '@/enums/active-step';
import Publication from '@/interfaces/i-publication';
import NewPublicationForm from './new-publication-form';


const baseTPath = 'components.NewPublicationFormsContainer';

const NewPublicationFormsContainer: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as ActiveStep | null;
  const t = useTranslations(baseTPath);

  const [step, setStep] = useState<ActiveStep>(stepParam || ActiveStep.GENERAL);

  const stepLabels: Partial<Record<ActiveStep, string>> = {
    [ActiveStep.GENERAL]: t('stepGeneral'),
  };

  const handleSubmit = (createdPublication: Publication) => {
    router.push(`/dashboard/publications/${createdPublication.id}`);
  };

  return (
    <>
      <Row className="my-3">
        <Col>
          <h4>{stepLabels[step]}</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          { step === ActiveStep.GENERAL && (
            <NewPublicationForm onSuccess={handleSubmit} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default NewPublicationFormsContainer;