"use client";
import React, { useState } from 'react';
import LoadingContainer from './loading-container';
import { Col, Row } from 'react-bootstrap';
import PaginatedResult from '@/interfaces/i-paginated-result';
import PaginationInfo from './pagination-info';
import { useTranslations } from 'next-intl';
import PaginationControls from './pagination-controls';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import MediaContribution from '@/interfaces/i-media-contribution';
import { useMediaContributionsQuery } from '@/hooks/use-media-contributions';
import MediaContributionOptionsCard from './media-contribution-options-card';

const baseTPath = 'components.MediaContributionsTable';

interface MediaContributionsTableProps {
  initialMediaContributions: PaginatedResult<MediaContribution>
}

const MediaContributionsTable: React.FC<MediaContributionsTableProps> = ({ initialMediaContributions }) => {
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

  const { data, isPending, isError, isFetching, isSuccess } = useMediaContributionsQuery(page, pageSize, initialMediaContributions);

  const mediaContributions = data?.items ?? [];
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
          <Col>{t('failMediaContributions')}</Col>
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
                itemName={t('mediaContributions')}
              />
          </Col>
        </Row>
      )}
      {mediaContributions && mediaContributions.length > 0 ? (
        mediaContributions.map((mediaContribution, index) => (
          <Row key={index}>
            <Col>
              <MediaContributionOptionsCard mediaContribution={mediaContribution} />
            </Col>
          </Row>
        ))
      ) : (
        <Row>
          <Col>{t('noMediaContributions')}</Col>
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
                itemName={t('mediaContributions')}
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
            {t('refreshMediaContributions')}
          </Col>
        </Row>
      )}
    </>
  )
}

export default MediaContributionsTable;