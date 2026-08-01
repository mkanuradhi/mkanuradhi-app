import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import UpdateBookSampleFileForm from '@/components/update-book-sample-file-form';

const baseTPath = 'pages.Dashboard.Books.EditSampleFile';

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

interface EditSampleFilePageProps {
  params: {
    locale: string;
    bookId: string;
  };
}

const EditSampleFilePage = async ({ params }: EditSampleFilePageProps) => {
  const { locale, bookId } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateBookSampleFileForm bookId={bookId} />
    </>
  );
};

export default EditSampleFilePage;