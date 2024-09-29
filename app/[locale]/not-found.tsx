import React from 'react';
import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import GlowLink from '../components/GlowLink';

const baseTPath = 'pages.NotFound';

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

const NotFound = () => {
  const t = useTranslations(baseTPath);

  return (
    <>
      <Container fluid="md">
          <Row>
            <Col>
              <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 'calc(100svh - 4.5rem - 4.5rem)' }}>
                <h1 className="my-3">{t('title')}</h1>
                <h2 className="my-3">{t('subTitle')}</h2>
                <FontAwesomeIcon icon={faTriangleExclamation} style={{ height: '72px' }} className="my-3" />
                <p className="my-3">
                  {
                    t.rich('description', {
                      strong: (chunks) => <strong>{chunks}</strong>,
                      link: (chunks) => <GlowLink href="/">{chunks}</GlowLink>,
                      em: (chunks) => <em>{chunks}</em>
                    })
                  }
                </p>
              </div>
            </Col>
          </Row>
      </Container>
    </>
  );
}

export default NotFound;
