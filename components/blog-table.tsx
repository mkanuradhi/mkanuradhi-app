"use client";
import React, { useState } from 'react';
import BlogPost from '@/interfaces/i-blog-post'
import { useBlogPostsQuery } from '@/hooks/use-blog-posts';
import LoadingContainer from './loading-container';
import { Col, Row } from 'react-bootstrap';
import { truncateText } from '@/utils/common-utils';
import BlogPostOptionsCard from './blog-post-options-card';
import PaginatedResult from '@/interfaces/i-paginated-result';
import PaginationInfo from './pagination-info';
import { useTranslations } from 'next-intl';
import PaginationControls from './pagination-controls';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

const baseTPath = 'components.BlogTable';

interface BlogTableProps {
  initialBlogPosts: PaginatedResult<BlogPost>
}

const BlogTable: React.FC<BlogTableProps> = ({ initialBlogPosts }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = Number(searchParams.get("page")) || 0;
  const [page, setPage] = useState(initialPage);
  const pageSize = 10;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(newPage));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const { data, isPending, isError, isFetching, isSuccess } = useBlogPostsQuery(page, pageSize, initialBlogPosts);

  const blogPosts = data?.items ?? [];
  const totalCount = data?.pagination.totalCount ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;
  const currentPage = data?.pagination.currentPage ?? 0;
  const currentPageSize = data?.pagination.currentPageSize ?? 0;

  return (
    <>
      { isPending && (
        <LoadingContainer />
      )}
      { isError && (
        <Row>
          <Col>{t('failPosts')}</Col>
        </Row>
      )}
      {totalCount > 0 && (
        <Row>
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
      {blogPosts && blogPosts.length > 0 ? (
        blogPosts.map((blogPost, index) => (
          <Row key={index}>
            <Col>
              <BlogPostOptionsCard
                id={blogPost.id}
                titleEn={blogPost.titleEn}
                summaryEn={truncateText(blogPost.summaryEn, 150)}
                titleSi={blogPost.titleSi}
                summarySi={truncateText(blogPost.summarySi, 150)}
                img={blogPost.primaryImage}
                path={blogPost.path}
                status={blogPost.status}
                dateTime={blogPost.dateTime}
              />
            </Col>
          </Row>
        ))
      ) : (
        <Row>
          <Col>{t('noPosts')}</Col>
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
      { isFetching && (
        <Row>
          <Col>
            {t('refreshPosts')}
          </Col>
        </Row>
      )}
    </>
  )
}

export default BlogTable;