"use client";
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Course from '@/interfaces/i-course';
import UpdateCourseSiForm from './update-course-si-form';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useCourseByIdQuery } from '@/hooks/use-courses';
import { useTranslations } from 'next-intl';
import UpdateCourseEnForm from './update-course-en-form';
import ActiveStep from '@/enums/active-step';

const baseTPath = 'components.UpdateCourseFormsContainer';

interface UpdateCourseFormsContainerProps {
  id: string;
}

const UpdateCourseFormsContainer:React.FC<UpdateCourseFormsContainerProps> = ({ id }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as ActiveStep | null;
  const t = useTranslations(baseTPath);

  const { data: course } = useCourseByIdQuery(id || '');
  const [step, setStep] = useState<ActiveStep>(stepParam || ActiveStep.EN);

  const stepLabels: Partial<Record<ActiveStep, string>> = {
    [ActiveStep.EN]: t('stepEn'),
    [ActiveStep.SI]: t('stepSi'),
    [ActiveStep.PRIMARY_IMAGE]: 'N/A',
  };

  const handleEnSubmit = (createdCourse: Course) => {
    setStep(ActiveStep.SI);
    router.push(`/dashboard/courses/${id}/edit?step=${ActiveStep.SI}`);
  };

  const handleSiSubmit = (updatedCourse: Course) => {
    router.push(`/dashboard/courses/${updatedCourse.id}`);
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
            <UpdateCourseEnForm id={id} onSuccess={handleEnSubmit} />
          )}
          { step === ActiveStep.SI && course && (
            <UpdateCourseSiForm id={course.id} v={course.v} onSuccess={handleSiSubmit} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default UpdateCourseFormsContainer;