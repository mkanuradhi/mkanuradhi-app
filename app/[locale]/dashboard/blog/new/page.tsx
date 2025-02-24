import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import NewBlogPostFormWrapper from '@/components/new-blog-post-form-wrapper';

const baseTPath = 'pages.Dashboard.Blog.New';

const NewBlogPostPage = async () => {
  const t = await getTranslations(baseTPath);

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <NewBlogPostFormWrapper />
    </>
  )
}

export default NewBlogPostPage;