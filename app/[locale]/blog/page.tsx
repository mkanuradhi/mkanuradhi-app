import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import BlogPostsViewer from '@/components/blog-posts-viewer';

const baseTPath = 'pages.Blog';

interface BlogPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata ({ params }: BlogPageProps) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    keywords: t('pageKeywords'),
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
      type: 'website',
      images: [
        {
          url: '/images/mkanuradhi.png',
          width: 1200,
          height: 630,
          alt: 'MKA',
        },
      ],
    }
  };
};

const BlogPage = async () => {
  const t = await getTranslations(baseTPath);

  return (
    <>
      <div className="blog">
        <Container fluid="md">
          <Row className="my-4">
            <Col>
              <h1>{t('title')}</h1>
            </Col>
          </Row>
          <BlogPostsViewer />
        </Container>
      </div>
    </>
  );
}

export default BlogPage;