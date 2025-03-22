import React from 'react';
import QuizOptionsViewer from '@/components/quiz-options-viewer';

interface QuizOptionsPageProps {
  params: {
    courseId: string;
    quizId: string;
  };
}

const QuizOptionsPage: React.FC<QuizOptionsPageProps> = ({ params }) => {
  const { courseId, quizId } = params;

  return (
    <>
      <QuizOptionsViewer courseId={courseId} quizId={quizId} />
    </>
  );
}

export default QuizOptionsPage;