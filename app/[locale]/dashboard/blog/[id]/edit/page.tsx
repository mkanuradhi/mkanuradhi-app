import UpdateBlogPostFormsContainer from '@/components/update-blog-post-forms-container';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

const baseTPath = 'pages.Dashboard.Blog.Edit';

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('title'),
    openGraph: {
      title: t('title'),
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

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

const EditBlogPostPage: React.FC<EditBlogPostPageProps> = async ({ params }) => {
  const t = await getTranslations(baseTPath);
  const { id } = params;

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateBlogPostFormsContainer id={id} />
    </>
  )
}

export default EditBlogPostPage;