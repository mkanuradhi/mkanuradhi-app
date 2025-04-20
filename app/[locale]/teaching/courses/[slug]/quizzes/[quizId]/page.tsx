import React from 'react';
import QuizViewer from '@/components/quiz-viewer';
import { ApiError } from '@/errors/api-error';
import { getQuizByCoursePathAndId } from '@/services/quiz-service';
import { notFound } from 'next/navigation';


interface QuizPageProps {
  params: {
    slug: string;
    quizId: string;
  };
}

export async function generateMetadata ({ params }: QuizPageProps) {
  const { slug, quizId } = params;
  let quiz;
  try {
    quiz = await getQuizByCoursePathAndId(slug, quizId);
  } catch (error: any) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }

  const pageDescriptionParts: string[] = [];
  if (quiz.titleEn) {
    pageDescriptionParts.push(quiz.titleEn);
  }
  if (quiz.titleSi) {
    pageDescriptionParts.push(`${quiz.titleSi}`);
  }
  const pageDescription = pageDescriptionParts.join(" | ");

  return {
    title: quiz.titleEn,
    description: pageDescription,
    generator: 'React',
    applicationName: 'mkanuradhi',
    referrer: 'origin-when-cross-origin',
    creator: 'Anuradha',
    publisher: 'M K A Ariyaratne',
    openGraph: {
      title: quiz.titleEn,
      description: pageDescription,
      siteName: 'mkanuradhi',
      type: 'website',
      images: [
        {
          url: '/images/mkanuradhi.png',
          width: 1200,
          height: 630,
          alt: 'MKA',
        },
      ],
    }
  };
};

const QuizPage: React.FC<QuizPageProps> = async ({ params }) => {
  const { slug, quizId } = params;

  let quiz;
    try {
      quiz = await getQuizByCoursePathAndId(slug, quizId);
    } catch (error: any) {
      if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
        notFound();
      }
      throw error;
    }

  return (
    <>
      <div className="quiz">
        <QuizViewer coursePath={slug} quiz={quiz} />
      </div>
    </>
  )
}

export default QuizPage;
