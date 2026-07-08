import React from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import { getLocalizedBooks } from '@/services/book-service';
import BooksViewer from '@/components/books-viewer';
import { LANG_EN, LANG_SI } from '@/constants/common-vars';

const baseTPath = 'pages.Books';
export const revalidate = 604800; // cache for 1 week

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    keywords: t('pageKeywords'),
    alternates: {
      canonical: `/${locale}/books`,
      languages: {
        en: `/${LANG_EN}/books`,
        si: `/${LANG_SI}/books`,
      },
    },
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
      type: 'website',
      url: `/${locale}/books`,
      siteName: 'mkanuradhi',
      locale: locale === LANG_SI ? 'si_LK' : 'en_US',
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
    },
    twitter: {
      card: 'summary_large_image',
      title: t('pageTitle'),
      description: t('pageDescription'),
      images: ['/images/mkanuradhi.png'],
    }
  };
};

const BooksPage = async () => {
  const t = await getTranslations(baseTPath);
  const locale = await getLocale();
  const lsBooksPaginatedResult = await getLocalizedBooks(locale, 0, 100);

  return (
    <>
      <div className="books">
        <Container fluid="md">
          <Row className="my-4">
            <Col>
              <section>
                <h1>{t('title')}</h1>
                <p>{t('description')}</p>
              </section>
              <section>
                <BooksViewer lsBooks={lsBooksPaginatedResult.items} />
              </section>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default BooksPage;