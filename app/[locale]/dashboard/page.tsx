import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import Role from '@/enums/role';
import BarCard from '@/components/bar-card';
import { getPublicationsByType, getRecentPublications, getYearlyPublications, getYearlyPublicationsByType } from '@/services/publication-service';
import StackedBarCard from '@/components/stacked-bar-card';
import PublicationType from '@/enums/publication-type';
import PieCard from '@/components/pie-card';
import RecentPublicationCard from '@/components/recent-publication-card';

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

  const yearlyPublications = (await getYearlyPublications()).map(item => ({
    year: `${item.year}`,
    [countLabel]: item.count,
  }));

  const yearlyPublicationsByType = (await getYearlyPublicationsByType()).map(item => {
    const { year, ...rest } = item;
    return {
      year: `${year}`,
      ...rest,
    };
  });

  const publicationsByType = (await getPublicationsByType()).map(item => ({
    id: t(`publicationType.${item.type}`),
    value: item.count,
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

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h1>{t('title')}</h1>
            <h4>{t.rich('welcome', {fullname: user?.fullName})}</h4>
            <p>{t.rich('userId', {userId: userId})}</p>
            <p>{t.rich('roleMessage', {roles: memberRoles.join(", ")})}</p>
          </Col>
        </Row>
        <Row>
          <Col>

            <Row>
              <Col md={6} className="mb-3">
                <BarCard
                  title={t('yearlyPublications')}
                  data={yearlyPublications}
                  keys={[countLabel]}
                  indexBy="year"
                  xAxisLabel={yearLabel}
                  yAxisLabel={countLabel}
                  integerOnlyYTicks={true}
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
            </Row>

          </Col>
        </Row>
      </Container>
    </>
  )
}

export default DashboardPage;