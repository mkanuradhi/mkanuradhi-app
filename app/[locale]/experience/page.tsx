import React from 'react';
import { useMessages, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';

const baseTPath = 'pages.Experience';

interface CareerPosition {
  post: string;
  organization: string;
  duration: string;
}

interface AcademicCareerPositionMessages {
  pages: {
    Experience: {
      academicExperiences: CareerPosition[];
    };
  };
}

interface AdministrativeCareerPositionMessages {
  pages: {
    Experience: {
      administrativeExperiences: CareerPosition[];
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
          url: '/images/mkanuradhi.png',
          width: 1200,
          height: 630,
          alt: 'MKA',
        },
      ],
    }
  };
};

const ExperiencePage = () => {
  const t = useTranslations(baseTPath);

  const academicCareerPositionMessages = useMessages() as unknown as AcademicCareerPositionMessages | undefined;
  const academicCareerPositions = academicCareerPositionMessages?.pages?.Experience?.academicExperiences as CareerPosition[];
  
  const administrativeCareerPositionMessages = useMessages() as unknown as AdministrativeCareerPositionMessages | undefined;
  const administrativeCareerPositions = administrativeCareerPositionMessages?.pages?.Experience?.administrativeExperiences as CareerPosition[];

  return (
    <>
      <div className="experience">
        <Container fluid="md">
          <Row className="my-4">
            <Col>
              <h1>{t('title')}</h1>
              <p>{t('description')}</p>
            </Col>
          </Row>
          <Row className="my-4">
            <Col>
              <h4>{t('academicTitle')}</h4>
              <ol>
                {academicCareerPositions.map((position, index) => (
                  <li key={index} className="my-3"><strong>{position.post}</strong>, {position.organization} ({position.duration}).</li>
                ))}
              </ol>
            </Col>
          </Row>
          <Row className="my-4">
            <Col>
              <h4>{t('administrativeTitle')}</h4>
              <ol>
                {administrativeCareerPositions.map((position, index) => (
                  <li key={index} className="my-3"><strong>{position.post}</strong>, {position.organization} ({position.duration}).</li>
                ))}
              </ol>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default ExperiencePage;