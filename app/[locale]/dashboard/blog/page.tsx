import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Button, Col, Row } from 'react-bootstrap';
import { getBlogPosts } from '@/services/blog-post-service';
import BlogTable from '@/components/blog-table';
import { Link } from '@/i18n/routing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ActiveStep from '@/enums/active-step';

const baseTPath = 'pages.Dashboard.Blog';

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('pageTitle'),
    openGraph: {
      title: t('pageTitle'),
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
          <Link href={`/dashboard/blog/new?step=${ActiveStep.EN}`}>
            <Button>
              <FontAwesomeIcon icon={faPlus} className="me-1" aria-hidden="true" />{ t('addNew') }
            </Button>
          </Link>
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