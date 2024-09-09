import React from 'react';
import { useMessages, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';

const baseTPath = 'pages.Teaching';

interface DescriptionMessages {
  pages: {
    Teaching: {
      descriptions: string[];
    };
  };
}

interface CourseDetail {
  location: string;
  courses: string[];
}

interface TeachingData {
  year: string;
  descriptions: CourseDetail[];
}

interface DetailMessages {
  pages: {
    Teaching: {
      details: TeachingData[];
    };
  };
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
          url: '',
          width: 800,
          height: 600,
          alt: 'MKA',
        },
      ],
    }
  };
};

const TeachingPage = () => {
  const t = useTranslations(baseTPath);

  const descriptionMessages = useMessages() as unknown as DescriptionMessages | undefined;
  const descriptions = descriptionMessages?.pages?.Teaching?.descriptions as string[];

  const detailsMessages = useMessages() as unknown as DetailMessages | undefined;
  const details = detailsMessages?.pages?.Teaching?.details as TeachingData[];

  return (
    <>
      <div className="teaching">
        <Container fluid="md">
          <Row className="my-4">
            <Col>
              <h1>{t('title')}</h1>
              <section>
                {descriptions.map((description, index) => (
                  <p key={index}>{description}</p>
                ))}
              </section>
              <h2>{t('subTitle')}</h2>
              {details.map((detail, index) => (
                <section key={index}>
                  <h3>{detail.year}</h3>
                  {detail.descriptions.map((desc, descIndex) => (
                    <div key={descIndex}>
                      <p>{desc.location}</p>
                      <ul>
                        {desc.courses.map((course, courseIndex) => (
                          <li key={courseIndex}>{course}</li>
                        ))}
                      </ul>
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