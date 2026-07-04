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
    openGraph: {
      title: t('title'),
      type:  'website',
      images: [
        {
          url:    '/images/mkanuradhi.png',
          width:  1200,
          height: 630,
          alt:    'MKA',
        },
        {
          url:    '/images/mkanuradhis.png',
          width:  600,
          height: 314,
          alt:    'MKA',
        },
      ],
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