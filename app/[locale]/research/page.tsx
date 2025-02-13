import React from 'react';
import { useMessages, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import ThesisDisplayer from '@/components/ThesisDisplayer';
import CurrentProjectsDisplayer from '@/components/CurrentProjectsDisplayer';
import PastProjectsDisplayer from '@/components/PastProjectsDisplayer';

const baseTPath = 'pages.Research';

interface ThesisDetail extends AbstractDetails {
  degree: string;
  topic: string;
  university: string;
  year: string;
  keywordsTitle?: string;
  keywords?: string[];
}

interface CurrentProject {
  studentName: string;
  degree: string;
  topic: string;
  year: string;
  supervisorsTitle: string;
  supervisors: string[];
}

interface PastProject extends CurrentProject, AbstractDetails {
}

interface AbstractDetails {
  abstractTitle: string;
  abstracts: string[];
}

interface ThesisMessages {
  pages: {
    Research: {
      thesisDetails: ThesisDetail[];
    };
  };
}

interface CurrentUnderGradProjectMessages {
  pages: {
    Research: {
      currentUnderGradProjects: CurrentProject[];
    };
  };
}

interface CurrentPostGradProjectMessages {
  pages: {
    Research: {
      currentPostGradProjects: CurrentProject[];
    };
  };
}

interface PastUnderGradProjectMessages {
  pages: {
    Research: {
      pastUnderGradProjects: PastProject[];
    };
  };
}

interface PastPostGradProjectMessages {
  pages: {
    Research: {
      pastPostGradProjects: PastProject[];
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

const ResearchPage = () => {
  const t = useTranslations(baseTPath);

  const thesisMessages = useMessages() as unknown as ThesisMessages | undefined;
  const thesisDetails = thesisMessages?.pages?.Research?.thesisDetails as ThesisDetail[];

  const currentUnderGradProjectMessages = useMessages() as unknown as CurrentUnderGradProjectMessages | undefined;
  const currentUnderGradProjects = currentUnderGradProjectMessages?.pages?.Research?.currentUnderGradProjects as CurrentProject[];

  const currentPostGradProjectMessages = useMessages() as unknown as CurrentPostGradProjectMessages | undefined;
  const currentPostGradProjects = currentPostGradProjectMessages?.pages?.Research?.currentPostGradProjects as CurrentProject[];

  const pastUnderGradProjectMessages = useMessages() as unknown as PastUnderGradProjectMessages | undefined;
  const pastUnderGradProjects = pastUnderGradProjectMessages?.pages?.Research?.pastUnderGradProjects as PastProject[];

  const pastPostGradProjectMessages = useMessages() as unknown as PastPostGradProjectMessages | undefined;
  const pastPostGradProjects = pastPostGradProjectMessages?.pages?.Research?.pastPostGradProjects as PastProject[];

  return (
    <>
      <div className="research">
        <Container fluid="md">
          <Row className="my-4">
            <Col>
              <h1>{t('title')}</h1>
              <section>
                <p>{t('description')}</p>
              </section>
              <section className="mt-4 mb-2">
                <h3>{t('thesisTitle')}</h3>
                <ThesisDisplayer thesisDetails={thesisDetails} />
              </section>
              {currentUnderGradProjects.length > 0 && (
                <section className="mt-4 mb-2">
                  <h3>{t('currentUnderGradTitle')}</h3>
                  <CurrentProjectsDisplayer currentProjects={currentUnderGradProjects} />
                </section>
              )}
              {currentPostGradProjects.length > 0 && (
                <section className="mt-4 mb-2">
                  <h3>{t('currentPostGradTitle')}</h3>
                  <CurrentProjectsDisplayer currentProjects={currentPostGradProjects} />
                </section>
              )}
              {pastUnderGradProjects.length > 0 && (
                <section className="mt-4 mb-2">
                  <h3>{t('pastUnderGradTitle')}</h3>
                  <PastProjectsDisplayer pastProjects={pastUnderGradProjects} />
                </section>
              )}
              {pastPostGradProjects.length > 0 && (
                <section className="mt-4 mb-2">
                  <h3>{t('pastPostGradTitle')}</h3>
                  <PastProjectsDisplayer pastProjects={pastPostGradProjects} />
                </section>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default ResearchPage;
