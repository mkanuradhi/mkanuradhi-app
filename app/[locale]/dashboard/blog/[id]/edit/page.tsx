import UpdateBlogPostFormsContainer from '@/components/update-blog-post-forms-container';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

const baseTPath = 'pages.Dashboard.Blog.Edit';

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