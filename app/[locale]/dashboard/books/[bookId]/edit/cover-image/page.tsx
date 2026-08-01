import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import UpdateBookCoverImageForm from '@/components/update-book-cover-image-form';

const baseTPath = 'pages.Dashboard.Books.EditCoverImage';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('title'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

interface EditCoverImagePageProps {
  params: {
    locale: string;
    bookId: string;
  };
}

const EditCoverImagePage = async ({ params }: EditCoverImagePageProps) => {
  const { locale, bookId } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateBookCoverImageForm bookId={bookId} />
    </>
  );
};

export default EditCoverImagePage;