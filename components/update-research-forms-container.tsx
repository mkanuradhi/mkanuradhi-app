"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ActiveStep from '@/enums/active-step';
import { useResearchByIdQuery } from '@/hooks/use-research';
import Research from '@/interfaces/i-research';
import UpdateResearchForm from './update-research-form';

const baseTPath = 'components.UpdateResearchFormsContainer';

interface UpdateResearchFormsContainerProps {
  researchId: string;
}

const UpdateResearchFormsContainer:React.FC<UpdateResearchFormsContainerProps> = ({ researchId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as ActiveStep | null;
  const t = useTranslations(baseTPath);

  const { data: research, isError, error } = useResearchByIdQuery(researchId);
  const [step, setStep] = useState<ActiveStep>(stepParam || ActiveStep.GENERAL);

  const stepLabels: Partial<Record<ActiveStep, string>> = {
    [ActiveStep.GENERAL]: t('stepGeneral'),
  };

  const handleSubmit = (updatedResearch: Research) => {
    router.push(`/dashboard/research/${updatedResearch.id}`);
  };

  if (isError && error) {
    return (
      <Row className="my-3">
        <Col>
          <h4>{t('failResearch')}</h4>
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
          { step === ActiveStep.GENERAL && research && (
            <UpdateResearchForm researchId={researchId} onSuccess={handleSubmit} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default UpdateResearchFormsContainer;