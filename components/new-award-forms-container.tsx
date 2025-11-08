"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ActiveStep from '@/enums/active-step';
import NewAwardEnForm from './new-award-en-form';
import Award from '@/interfaces/i-award';

const baseTPath = 'components.NewBlogPostFormsContainer';

const NewAwardFormsContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as ActiveStep | null;
  const t = useTranslations(baseTPath);

  const [step, setStep] = useState<ActiveStep>(stepParam || ActiveStep.EN);

  const stepLabels: Partial<Record<ActiveStep, string>> = {
    [ActiveStep.EN]: t('stepEn'),
    [ActiveStep.SI]: t('stepSi'),
    [ActiveStep.PRIMARY_IMAGE]: t('stepPrimaryImage'),
  };

  const handleEnSubmit = (createdAward: Award) => {
    setStep(ActiveStep.SI);
    router.push(`/dashboard/awards/${createdAward.id}/edit?step=${ActiveStep.SI}`);
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
          { step === ActiveStep.EN && (
            <NewAwardEnForm onSuccess={handleEnSubmit} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default NewAwardFormsContainer;