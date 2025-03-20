import React from 'react';

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
      <h1>Quiz {courseId}</h1>
      <h3>{quizId}</h3>
      <div className="quiz">
        {/* <QuizOptionsViewer quizId={quizId} /> */}
      </div>
      
    </>
  );
}

export default QuizOptionsPage;