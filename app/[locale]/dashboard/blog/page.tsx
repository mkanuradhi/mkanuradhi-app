import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Col, Row } from 'react-bootstrap';
import { getBlogPosts } from '@/services/blog-post-service';
import BlogTable from '@/components/blog-table';

const baseTPath = 'pages.Dashboard.Blog';

const BlogPage = async ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  const initialPaginatedResult = await getBlogPosts(0, 10);

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <BlogTable initialBlogPosts={initialPaginatedResult} />
        </Col>
      </Row>
    </>
  )
}

export default BlogPage;