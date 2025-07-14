import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import Role from '@/enums/role';
import BarCard from '@/components/bar-card';
import { getYearlyPublications, getYearlyPublicationsByType } from '@/services/publication-service';
import StackedBarCard from '@/components/stacked-bar-card';
import PublicationType from '@/enums/publication-type';

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

  const yearlyPublications = (await getYearlyPublications()).map(item => ({
    year: `${item.year}`,
    count: item.count,
  }));

  const yearlyPublicationsByType = (await getYearlyPublicationsByType()).map(item => {
    const { year, ...rest } = item;
    return {
      year: `${year}`,
      ...rest,
    };
  });

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
                  keys={['count']}
                  indexBy="year"
                  xAxisLabel={t('year')}
                  yAxisLabel={t('count')}
                  integerOnlyYTicks={true}
                />
              </Col>
              <Col md={6} className="mb-3">
                <StackedBarCard
                  title={t('yearlyPublicationsByType')}
                  data={yearlyPublicationsByType}
                  keys={Object.values(PublicationType)}
                  indexBy="year"
                  xAxisLabel={t('year')}
                  yAxisLabel={t('count')}
                  integerOnlyYTicks={false}
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