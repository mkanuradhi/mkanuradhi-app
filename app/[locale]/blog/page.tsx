import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import BlogPostsViewer from '@/components/blog-posts-viewer';

const baseTPath = 'pages.Blog';
export const revalidate = 7200; // cache for 2 hours

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
          url: '/images/og/mka.png',
          width: 1200,
          height: 630,
          alt: 'M.K.A. Ariyaratne, Senior Lecturer in Computer Science',
          type: 'image/png',
        },
        {
          url: '/images/og/mka-600.png',
          width: 600,
          height: 315,
          alt: 'M.K.A. Ariyaratne, Senior Lecturer in Computer Science',
          type: 'image/png',
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