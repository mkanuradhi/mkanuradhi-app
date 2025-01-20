import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import { getPublishedBlogPosts } from '@/app/services/blog-post-service';
import BlogPostCard from '@/app/components/BlogPostCard';

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

const BlogPage: React.FC<BlogPageProps> = async ({ params }) => {
  const { locale } = params;

  const t = await getTranslations(baseTPath);
  const blogPostViews = await getPublishedBlogPosts(locale, 0, 10);

  return (
    <>
      <div className="blog">
        <Container fluid="md">
          <Row className="my-4">
            <Col>
              <h1>{t('title')}</h1>
            </Col>
          </Row>
          {blogPostViews && blogPostViews.length > 0 ? (
            blogPostViews.map( (blogPostView, index) => (
              <Row key={index}>
                <Col>
                  <BlogPostCard
                    title={blogPostView.title}
                    summary={blogPostView.summary}
                    img={blogPostView.primaryImage}
                    path={blogPostView.path}
                    fDate={blogPostView.formattedDate}
                  />
                </Col>
              </Row>
            ))
          ) : (
            <Row>
              <Col>
                <p>{t('noPosts')}</p>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </>
  );
}

export default BlogPage;