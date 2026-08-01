import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import UpdateBookAuthorImageForm from '@/components/update-book-author-image-form';

const baseTPath = 'pages.Dashboard.Books.EditAuthorImage';

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

interface EditBookAuthorImagePageProps {
  params: {
    locale: string;
    bookId: string;
    authorId: string;
  };
}

const EditBookAuthorImagePage = async ({ params }: EditBookAuthorImagePageProps) => {
  const { locale, bookId, authorId } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateBookAuthorImageForm bookId={bookId} authorId={authorId} />
    </>
  );
};

export default EditBookAuthorImagePage;