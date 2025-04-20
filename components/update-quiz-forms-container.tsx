"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ActiveStep from '@/enums/active-step';
import { useQuizByIdQuery } from '@/hooks/use-quizzes';
import Quiz from '@/interfaces/i-quiz';
import UpdateQuizForm from './update-quiz-form';

const baseTPath = 'components.UpdateQuizFormsContainer';

interface UpdateQuizFormsContainerProps {
  courseId: string;
  quizId: string;
}

const UpdateQuizFormsContainer:React.FC<UpdateQuizFormsContainerProps> = ({ courseId, quizId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as ActiveStep | null;
  const t = useTranslations(baseTPath);

  const { data: quiz } = useQuizByIdQuery(courseId, quizId);
  const [step, setStep] = useState<ActiveStep>(stepParam || ActiveStep.GENERAL);

  const stepLabels: Partial<Record<ActiveStep, string>> = {
    [ActiveStep.GENERAL]: t('stepGeneral'),
  };

  const handleSubmit = (updatedQuiz: Quiz) => {
    router.push(`/dashboard/courses/${courseId}/quizzes/${updatedQuiz.id}`);
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
          { step === ActiveStep.GENERAL && quiz && (
            <UpdateQuizForm courseId={courseId} quizId={quizId} v={quiz.v} onSuccess={handleSubmit} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default UpdateQuizFormsContainer;