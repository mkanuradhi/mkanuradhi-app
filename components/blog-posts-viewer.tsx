"use client";
import React, { useState } from 'react';
import { useBlogPostViewsQuery } from '@/hooks/use-blog-posts';
import { useLocale, useTranslations } from 'next-intl';
import LoadingContainer from './loading-container';
import { Col, Row } from 'react-bootstrap';
import BlogPostCard from './BlogPostCard';
import PaginationInfo from './pagination-info';
import PaginationControls from './pagination-controls';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

const baseTPath = 'components.BlogPostsViewer';

const BlogPostsViewer = () => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = Number(searchParams.get("page")) || 0;
  const [page, setPage] = useState(initialPage);
  const pageSize = 10;

  const { data, isPending, isError, isFetching, isSuccess } = useBlogPostViewsQuery(locale, page, pageSize);

  const blogPostViews = data?.items ?? [];
  const totalCount = data?.pagination.totalCount ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;
  const currentPage = data?.pagination.currentPage ?? 0;
  const currentPageSize = data?.pagination.currentPageSize ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(newPage));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      { (isPending || isFetching) && (
        <LoadingContainer message={t('refreshPosts')} />
      )}
      { isError && (
        <Row>
          <Col>
            <h5>{t('failPosts')}</h5>
          </Col>
        </Row>
      )}
      {blogPostViews && blogPostViews.length > 0 && 
        blogPostViews.map((blogPostView, index) => (
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
      }
      {!isFetching && (!blogPostViews || blogPostViews.length < 1) && (
        <Row>
          <Col>
            <h5>{t('noPosts')}</h5>
          </Col>
        </Row>
      )}
      {totalPages > 1 && (
        <Row className="mb-3">
          <Col className="text-center">
            <PaginationInfo
                totalCount={totalCount}
                totalPages={totalPages}
                currentPage={currentPage}
                currentPageSize={currentPageSize}
                pageSize={pageSize}
                itemName={t('blogPosts')}
              />
          </Col>
        </Row>
      )}
      { isSuccess && totalPages > 1 && (
        <Row>
          <Col>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            currentPageSize={currentPageSize}
            onPageChange={handlePageChange}
          />
          </Col>
        </Row>
      )}
    </>
  )
}

export default BlogPostsViewer