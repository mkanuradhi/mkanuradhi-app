import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Col, Row } from 'react-bootstrap';
import { getContactMessages } from '@/services/contact-service';
import ContactMessagesTable from '@/components/contact-messages-table';
import { auth } from '@clerk/nextjs/server';

const baseTPath = 'pages.Dashboard.Contact';

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('pageTitle'),
    openGraph: {
      title: t('pageTitle'),
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

const ContactPage = async ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });
  const { getToken } = await auth();
  const token = (await getToken()) ?? '';

  const initialPaginatedResult = await getContactMessages(0, 10, token);

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <ContactMessagesTable initialContactMessages={initialPaginatedResult} />
        </Col>
      </Row>
    </>
  )
}

export default ContactPage;