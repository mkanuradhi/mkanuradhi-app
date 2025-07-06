"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ActiveStep from '@/enums/active-step';
import Research from '@/interfaces/i-research';
import NewResearchForm from './new-research-form';


const baseTPath = 'components.NewResearchFormsContainer';

const NewResearchFormsContainer: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as ActiveStep | null;
  const t = useTranslations(baseTPath);

  const [step, setStep] = useState<ActiveStep>(stepParam || ActiveStep.GENERAL);

  const stepLabels: Partial<Record<ActiveStep, string>> = {
    [ActiveStep.GENERAL]: t('stepGeneral'),
  };

  const handleSubmit = (createdResearch: Research) => {
    router.push(`/dashboard/research/${createdResearch.id}`);
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
            <NewResearchForm onSuccess={handleSubmit} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default NewResearchFormsContainer;