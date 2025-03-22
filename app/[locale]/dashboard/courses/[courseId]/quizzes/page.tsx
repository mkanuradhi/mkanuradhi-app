import React from 'react';
import QuizzesTable from '@/components/quizzes-table';

interface QuizzesPageProps {
  params: {
    courseId: string;
  };
}

const QuizzesPage: React.FC<QuizzesPageProps> = async ({ params }) => {
  const { courseId } = params;

  return (
    <>
      <QuizzesTable courseId={courseId} />
    </>
  )
}

export default QuizzesPage;