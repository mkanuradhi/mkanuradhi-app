import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import UpdateBookPreviewImagesForm from '@/components/update-book-preview-images-form';

const baseTPath = 'pages.Dashboard.Books.EditPreviewImages';

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

interface EditPreviewImagesPageProps {
  params: {
    locale: string;
    bookId: string;
  };
}

const EditPreviewImagesPage = async ({ params }: EditPreviewImagesPageProps) => {
  const { locale, bookId } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateBookPreviewImagesForm bookId={bookId} />
    </>
  );
};

export default EditPreviewImagesPage;