import React from 'react';
import { getTranslations } from 'next-intl/server';
import CourseView from '@/interfaces/i-course-view';
import { getActivatedCourses } from '@/services/course-service';
import { GroupedCourses } from '@/interfaces/i-grouped-courses';
import CoursesContainer from '@/components/courses-container';

const baseTPath = 'pages.Teaching.Courses';
export const revalidate = 7200; // cache for 2 hours

const groupCoursesByYearAndLocation = (items: CourseView[]): GroupedCourses[] => {
  const grouped: Record<number, Record<string, CourseView[]>> = {};

  items.forEach(course => {
    const { year, location } = course;
    if (!grouped[year]) {
      grouped[year] = {};
    }
    if (!grouped[year][location]) {
      grouped[year][location] = [];
    }
    grouped[year][location].push(course);
  });

  const result: GroupedCourses[] = Object.keys(grouped)
    .map(yearStr => {
      const year = parseInt(yearStr, 10);
      const locations = Object.keys(grouped[year]).map(location => ({
        location,
        courses: grouped[year][location],
      }));
      return { year, locations };
    })
    .sort((a, b) => b.year - a.year); // Sort years descending

  return result;
}

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

const CoursesPage = async ({ params }: { params: { locale: string } }) => {
  const { locale } = params;

  // Fetch and group courses.
  const coursesResponse = await getActivatedCourses(locale, 0, 100);
  const groupedCourses = groupCoursesByYearAndLocation(coursesResponse.items);

  return (
    <>
      <CoursesContainer groupedCourses={groupedCourses} />
    </>
  )
}

export default CoursesPage;