import React from 'react';
import QuizzesContainer from '@/components/quizzes-container';
import { getQuizzesByCoursePath } from '@/services/quiz-service';
import { getTranslations } from 'next-intl/server';


const baseTPath = 'pages.Teaching.Courses.Quizzes';

export const revalidate = 60;

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    keywords: t('pageKeywords'),
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
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

const QuizzesPage = async ({ params }: { params: { locale: string, slug: string } }) => {
  const { slug } = params;
  
  const quizzesResponse = await getQuizzesByCoursePath(slug, 0, 100);
  const quizzes = quizzesResponse.items;

  return (
    <>
      <QuizzesContainer coursePath={slug} quizzes={quizzes} />
    </>
  )
};

export default QuizzesPage;