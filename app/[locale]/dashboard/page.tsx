import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import Role from '@/enums/role';
import BarCard from '@/components/bar-card';
import { getPublicationKeywordFrequencies, getPublicationsByType, getPublicationSummary, getRecentPublications, getYearlyPublications, getYearlyPublicationsByType } from '@/services/publication-service';
import StackedBarCard from '@/components/stacked-bar-card';
import PublicationType from '@/enums/publication-type';
import PieCard from '@/components/pie-card';
import RecentPublicationCard from '@/components/recent-publication-card';
import LineCard from '@/components/line-card';
import WordCloudCard from '@/components/word-cloud-card';
import PublicationSummaryCard from '@/components/publication-summary-card';
import { getResearchSummary } from '@/services/research-service';
import ResearchSummaryCard from '@/components/research-summary-card';

const baseTPath = 'pages.Dashboard';

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
        {
          url: '/images/mkanuradhis.png',
          width: 600,
          height: 314,
          alt: 'MKA',
        },
      ],
    }
  };
};

const DashboardPage = async ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });
  const { userId, sessionClaims } = await auth();
  const user = await currentUser();

  const memberRoles = sessionClaims?.metadata?.roles as Role[] || [];

  const countLabel = t('count');
  const yearLabel = t('year');

  const yearlyPublications = await getYearlyPublications();

  const translatedYearlyPublicationsBar = yearlyPublications.map(item => ({
    year: `${item.label}`,
    [countLabel]: item.value,
  }));

  const translatedYearlyPublicationsLine = [
    {
      id: t('allPublications'),
      data: yearlyPublications.map(item => ({ x: `${item.label}`, y: item.value })),
    },
  ];

  const yearlyPublicationsByType = (await getYearlyPublicationsByType()).map(item => {
    const { year, ...rest } = item;
    return {
      year: `${year}`,
      ...rest,
    };
  });

  const publicationsByType = (await getPublicationsByType()).map(item => ({
    id: t(`publicationType.${item.label}`),
    value: item.value,
  }));

  const translatedPublicationTypes = Object.fromEntries(
    Object.values(PublicationType).map(key => [key, t(`publicationType.${key}`)])
  );

  const translatedYearlyPublicationsByType = yearlyPublicationsByType.map(item => {
    const { year, ...rest } = item;

    const localizedEntry = Object.fromEntries(
      Object.entries(rest).map(([key, value]) => [
        translatedPublicationTypes[key], // localize the key
        value,
      ])
    );

    return {
      year: `${year}`,
      ...localizedEntry,
    };
  });

  const recentPublications = await getRecentPublications(5);

  const publicationKeywords = await getPublicationKeywordFrequencies();

  const translatedPublicationKeywords = publicationKeywords.map(item => ({
    text: `${item.label}`,
    value: item.value,
  }));

  const publicationSummary = await getPublicationSummary();

  const researchSummary = await getResearchSummary();

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h1>{t('title')}</h1>
            <h4>{t.rich('welcome', {fullname: user?.fullName})}</h4>
          </Col>
        </Row>
        <Row>
          <Col>

            <Row>
              <Col md={4} className="mb-3">
                <PublicationSummaryCard summary={publicationSummary} />
              </Col>
              <Col md={4} className="mb-3">
                <ResearchSummaryCard summary={researchSummary} />
              </Col>
              {/* <Col md={6} className="mb-3">
                <BarCard
                  title={t('yearlyPublications')}
                  data={translatedYearlyPublicationsBar}
                  keys={[countLabel]}
                  indexBy="year"
                  xAxisLabel={yearLabel}
                  yAxisLabel={countLabel}
                  integerOnlyYTicks={true}
                />
              </Col> */}
              <Col md={6} className="mb-3">
                <LineCard
                  title={t('yearlyPublications')}
                  data={translatedYearlyPublicationsLine}
                  xAxisLabel={yearLabel}
                  yAxisLabel={countLabel}
                  integerOnlyYTicks={false}
                />
              </Col>
              <Col md={6} className="mb-3">
                <StackedBarCard
                  title={t('yearlyPublicationsByType')}
                  data={translatedYearlyPublicationsByType}
                  keys={Object.values(translatedPublicationTypes)}
                  indexBy="year"
                  xAxisLabel={yearLabel}
                  yAxisLabel={countLabel}
                  integerOnlyYTicks={false}
                />
              </Col>
              <Col md={6} className="mb-3">
                <PieCard
                  title={t('publicationsByType')}
                  data={publicationsByType}
                  innerRadius={0.5}
                />
              </Col>
              <Col md={6} className="mb-3">
                <RecentPublicationCard
                  title={t('recentPublications')}
                  publications={recentPublications}
                />
              </Col>
              <Col md={6} className="mb-3">
                <WordCloudCard
                  title={t('publicationKeywordCloud')}
                  data={translatedPublicationKeywords}
                />
              </Col>
            </Row>

          </Col>
        </Row>
        <Row>
          <Col md={8}>
            <small>
              {t.rich('userIdMessage', {
                userId,
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </small>
          </Col>
          <Col>
            <small>
              {t.rich('roleMessage', {
                roles: memberRoles.join(", "),
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </small>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default DashboardPage;