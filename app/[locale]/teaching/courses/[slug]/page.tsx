import React from 'react';
import { getCachedCourseByPath } from '@/services/course-service';
import { notFound } from 'next/navigation';
import { ApiError } from '@/errors/api-error';
import CourseViewer from '@/components/course-viewer';

export const revalidate = 3600; // cache for 1 hour

interface CoursePageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata ({ params }: CoursePageProps) {
  const { locale, slug } = params;
  let courseView;
  try {
    courseView = await getCachedCourseByPath(locale, slug);
  } catch (error: any) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }

  const pageDescriptionParts: string[] = [];
  if (courseView.code) {
    pageDescriptionParts.push(courseView.code);
  }
  if (courseView.credits) {
    pageDescriptionParts.push(`${courseView.credits} Credits`);
  }
  pageDescriptionParts.push(`${courseView.title}`);
  pageDescriptionParts.push(`${courseView.year}`);
  const pageDescription = pageDescriptionParts.join(" | ");

  return {
    title: courseView.title,
    description: pageDescription,
    generator: 'React',
    applicationName: 'mkanuradhi',
    referrer: 'origin-when-cross-origin',
    creator: 'Anuradha',
    publisher: 'M K A Ariyaratne',
    openGraph: {
      title: courseView.title,
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

const CoursePage: React.FC<CoursePageProps> = async ({ params }) => {
  const { locale, slug } = params;
  let courseView;
  try {
    courseView = await getCachedCourseByPath(locale, slug);
  } catch (error: any) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }

  return (
    <>
      <div className="course">
        <CourseViewer courseView={courseView} />
      </div>
    </>
  );
}

export default CoursePage;