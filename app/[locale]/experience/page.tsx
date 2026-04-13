import React from 'react';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import GlowLink from '@/components/GlowLink';

const baseTPath = 'pages.Experience';
export const revalidate = 604800; // cache for 1 week

interface CareerPosition {
  post: string;
  organization: string;
  duration: string;
  url: string;
}

interface ProfessionalPosition {
  post: string;
  event: string;
  duration: string;
  location: string;
  url: string;
}

export async function generateMetadata ({ params }: { params: Promise<{locale: string}> }) {
  const { locale } = await params;
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

const ExperiencePage = async ({ params }: { params: Promise<{locale: string}> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: baseTPath });
  const messages = await getMessages({ locale }) as any;

  const academicCareerPositions = messages?.pages?.Experience?.academicExperiences as CareerPosition[];
  const administrativeCareerPositions = messages?.pages?.Experience?.administrativeExperiences as CareerPosition[];
  const professionalPositions = messages?.pages?.Experience?.professionalExperiences as ProfessionalPosition[];

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
                  <li key={index} className="my-3">
                    <span><strong>{position.post}</strong></span>
                    { position.organization && (<span>, {position.organization}</span>) }
                    { position.duration && (<span className="ms-1">({position.duration})</span>) }
                    { position.url && (
                      <span className="ms-2">
                        <GlowLink href={position.url} newTab={true} withArrow={true}>
                          {position.url}
                        </GlowLink>
                      </span>
                    ) }
                  </li>
                ))}
              </ol>
            </Col>
          </Row>
          <Row className="my-4">
            <Col>
              <h4>{t('administrativeTitle')}</h4>
              <ol>
                {administrativeCareerPositions.map((position, index) => (
                  <li key={index} className="my-3">
                    <span><strong>{position.post}</strong></span>
                    { position.organization && (<span>, {position.organization}</span>) }
                    { position.duration && (<span className="ms-1">({position.duration})</span>) }
                    { position.url && (
                      <span className="ms-2">
                        <GlowLink href={position.url} newTab={true} withArrow={true}>
                          {position.url}
                        </GlowLink>
                      </span>
                    ) }
                  </li>
                ))}
              </ol>
            </Col>
          </Row>
          <Row className="my-4">
            <Col>
              <h4>{t('professionalTitle')}</h4>
              <ol>
                {professionalPositions.map((position, index) => (
                  <li key={index} className="my-3">
                    <span><strong>{position.post}</strong></span>
                    { position.event && (<span>, {position.event}</span>) }
                    { position.duration && (<span className="ms-1">({position.duration})</span>) }
                    { position.location && (<span className="ms-1">- {position.location}</span>) }
                    { position.url && (
                      <span className="ms-2">
                        <GlowLink href={position.url} newTab={true} withArrow={true}>
                          {position.url}
                        </GlowLink>
                      </span>
                    ) }
                  </li>
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