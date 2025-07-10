import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import { getResearches } from '@/services/research-service';
import ThesesViewer from '@/components/theses-viewer';
import SupervisionStatus from '@/enums/supervision-status';
import DegreeType from '@/enums/degree-type';
import ResearchViewer from '@/components/research-viewer';

const baseTPath = 'pages.Research';

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

const ResearchPage = async () => {
  const t = await getTranslations(baseTPath);

  const researchPaginatedResult = await getResearches(0, 100);

  const theses = researchPaginatedResult.items?.filter(item => item.isMine === true) || [];
  const inProgressUnderGradResearch = (
    researchPaginatedResult.items?.filter(item =>
      !item.isMine &&
      item.supervisionStatus === SupervisionStatus.IN_PROGRESS &&
      (item.type === DegreeType.DIPLOMA || item.type === DegreeType.HIGHER_DIPLOMA || item.type === DegreeType.BSC)
    ) ?? []
  );
  const completedUnderGradResearch = (
    researchPaginatedResult.items?.filter(item =>
      !item.isMine &&
      item.supervisionStatus === SupervisionStatus.COMPLETED &&
      (item.type === DegreeType.DIPLOMA || item.type === DegreeType.HIGHER_DIPLOMA || item.type === DegreeType.BSC)
    ) ?? []
  );
  const inProgressPostGradResearch = (
    researchPaginatedResult.items?.filter(item =>
      !item.isMine &&
      item.supervisionStatus === SupervisionStatus.IN_PROGRESS &&
      (item.type === DegreeType.POSTGRADUATE_DIPLOMA || item.type === DegreeType.MSC || item.type === DegreeType.MPHIL || item.type === DegreeType.PHD)
    ) ?? []
  );
  const completedPostGradResearch = (
    researchPaginatedResult.items?.filter(item =>
      !item.isMine &&
      item.supervisionStatus === SupervisionStatus.COMPLETED &&
      (item.type === DegreeType.POSTGRADUATE_DIPLOMA || item.type === DegreeType.MSC || item.type === DegreeType.MPHIL || item.type === DegreeType.PHD)
    ) ?? []
  );

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
                <ThesesViewer theses={theses} />
              </section>
              {inProgressUnderGradResearch.length > 0 && (
                <section className="mt-4 mb-2">
                  <h3>{t('currentUnderGradTitle')}</h3>
                  <ResearchViewer researches={inProgressUnderGradResearch} />
                </section>
              )}
              {completedUnderGradResearch.length > 0 && (
                <section className="mt-4 mb-2">
                  <h3>{t('pastUnderGradTitle')}</h3>
                  <ResearchViewer researches={completedUnderGradResearch} />
                </section>
              )}
              {inProgressPostGradResearch.length > 0 && (
                <section className="mt-4 mb-2">
                  <h3>{t('currentPostGradTitle')}</h3>
                  <ResearchViewer researches={inProgressPostGradResearch} />
                </section>
              )}
              {completedPostGradResearch.length > 0 && (
                <section className="mt-4 mb-2">
                  <h3>{t('pastPostGradTitle')}</h3>
                  <ResearchViewer researches={completedPostGradResearch} />
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
