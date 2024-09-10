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


interface CareerPositionMessages {
  pages: {
    Experience: {
      experiences: CareerPosition[];
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

  const careerPositionMessages = useMessages() as unknown as CareerPositionMessages | undefined;
  const careerPositions = careerPositionMessages?.pages?.Experience?.experiences as CareerPosition[];

  return (
    <>
      <div className="experience">
        <Container fluid="md">
          <Row className="my-4">
            <Col>
              <h1>{t('title')}</h1>
              <section>
                <p>{t('description')}</p>
              </section>
              <section>
                <ol>
                  {careerPositions.map((position, index) => (
                    <li key={index} className="my-3"><strong>{position.post}</strong>, {position.organization} ({position.duration}).</li>
                  ))}
                </ol>
              </section>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default ExperiencePage;