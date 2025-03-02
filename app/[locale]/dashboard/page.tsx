import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Link } from '@/i18n/routing';
import Role from '@/enums/role';

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
      </Container>
    </>
  )
}

export default DashboardPage;