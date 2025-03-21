import React from 'react';
import QuizzesOptionsViewer from '@/components/quizzes-options-viewer';

interface QuizzesPageProps {
  params: {
    courseId: string;
  };
}

const QuizzesPage: React.FC<QuizzesPageProps> = async ({ params }) => {
  const { courseId } = params;

  return (
    <>
      <QuizzesOptionsViewer courseId={courseId} />
    </>
  )
}

export default QuizzesPage;