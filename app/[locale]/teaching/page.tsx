import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import CourseView from '@/interfaces/i-course-view';
import { getActivatedCourses } from '@/services/course-service';
import CourseCard from '@/components/course-card';

const baseTPath = 'pages.Teaching';

export const revalidate = 60;

interface GroupedCourses {
  year: number;
  locations: Array<{
    location: string;
    courses: CourseView[];
  }>;
}

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

const TeachingPage = async ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  // Fetch and group courses.
  const coursesResponse = await getActivatedCourses(locale, 0, 100);
  const groupedData = groupCoursesByYearAndLocation(coursesResponse.items);

  return (
    <>
      <div className="teaching">
        <Container fluid="md">
          <Row className="mt-4">
            <Col>
              <h1>{t('title')}</h1>
              <section>
                <p className="mt-4">{ t('description') }</p>
              </section>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <h2>{t('subTitle')}</h2>
              {groupedData.map(group => (
                <section key={group.year} className="mt-4">
                  <h3>{group.year}</h3>
                  {group.locations.map((locGroup, index) => (
                    <div key={index} className="mb-4">
                      <h6>{locGroup.location}</h6>
                      <Row>
                        {locGroup.courses.map(course => (
                          <Col xs={12} sm={12} md={6} lg={4} xxl={3} key={course.id} className="mb-3">
                            <CourseCard course={course} />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  ))}
                </section>
              ))}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default TeachingPage;