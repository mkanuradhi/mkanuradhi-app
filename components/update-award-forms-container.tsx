"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Award from '@/interfaces/i-award';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useAwardByIdQuery } from '@/hooks/use-awards';
import { useTranslations } from 'next-intl';
import UpdateAwardEnForm from './update-award-en-form';
import ActiveStep from '@/enums/active-step';



const baseTPath = 'components.UpdateAwardFormsContainer';

interface UpdateAwardFormsContainerProps {
  id: string;
}

const UpdateAwardFormsContainer:React.FC<UpdateAwardFormsContainerProps> = ({ id }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as ActiveStep | null;
  const t = useTranslations(baseTPath);

  const { data: award } = useAwardByIdQuery(id || '');
  const [step, setStep] = useState<ActiveStep>(stepParam || ActiveStep.EN);

  const stepLabels: Partial<Record<ActiveStep, string>> = {
    [ActiveStep.EN]: t('stepEn'),
    [ActiveStep.SI]: t('stepSi'),
    [ActiveStep.PRIMARY_IMAGE]: 'N/A',
  };

  const handleEnSubmit = (createdAward: Award) => {
    setStep(ActiveStep.SI);
    router.push(`/dashboard/awards/${id}/edit?step=${ActiveStep.SI}`);
  };

  const handleSiSubmit = (updatedAward: Award) => {
    router.push(`/dashboard/awards/${updatedAward.id}`);
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
            <UpdateAwardEnForm id={id} onSuccess={handleEnSubmit} />
          )}
          { step === ActiveStep.SI && award && (
            <></>
            // <UpdateAwardSiForm id={award.id} v={award.v} onSuccess={handleSiSubmit} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default UpdateAwardFormsContainer;