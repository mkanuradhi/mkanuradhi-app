"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ActiveStep from '@/enums/active-step';
import NewQuizForm from './new-quiz-form';
import Quiz from '@/interfaces/i-quiz';


const baseTPath = 'components.NewQuizFormsContainer';

interface NewQuizFormsContainerProps {
  courseId: string;
}

const NewQuizFormsContainer: React.FC<NewQuizFormsContainerProps> = ({courseId}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as ActiveStep | null;
  const t = useTranslations(baseTPath);

  const [step, setStep] = useState<ActiveStep>(stepParam || ActiveStep.GENERAL);

  const stepLabels: Partial<Record<ActiveStep, string>> = {
    [ActiveStep.GENERAL]: t('stepGeneral'),
  };

  const handleSubmit = (createdQuiz: Quiz) => {
    router.push(`/dashboard/courses/${courseId}/quizzes/${createdQuiz.id}`);
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
            <NewQuizForm onSuccess={handleSubmit} courseId={courseId} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default NewQuizFormsContainer;