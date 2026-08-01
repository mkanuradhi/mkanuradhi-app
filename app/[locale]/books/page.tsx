import React from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import { getLocalizedBooks } from '@/services/book-service';
import BooksViewer from '@/components/books-viewer';
import { LANG_EN, LANG_SI } from '@/constants/common-vars';
import ApiErrorAlert from '@/components/api-error-alert';

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
          url: '/images/og/mka-books.png',
          width: 1200,
          height: 630,
          alt: 'M.K.A. Ariyaratne, Senior Lecturer in Computer Science',
          type: 'image/png',
        },
        {
          url: '/images/og/mka-books-600.png',
          width: 600,
          height: 315,
          alt: 'M.K.A. Ariyaratne, Senior Lecturer in Computer Science',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('pageTitle'),
      description: t('pageDescription'),
      images: ['/images/og/mka-books.png'],
    }
  };
};

const BooksPage = async () => {
  const t = await getTranslations(baseTPath);
  const locale = await getLocale();

  let lsBooksPaginatedResult = null;
  let fetchError: unknown = null;

  try {
    lsBooksPaginatedResult = await getLocalizedBooks(locale, 0, 100);
  } catch (err) {
    fetchError = err;
  }

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
                {fetchError ? (
                  <ApiErrorAlert error={fetchError} message={t('loadFailed')} />
                ) : (
                  <BooksViewer lsBooks={lsBooksPaginatedResult!.items} />
                )}
              </section>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default BooksPage;