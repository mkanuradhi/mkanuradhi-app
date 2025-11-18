"use client";
import React, { useState } from 'react';
import LoadingContainer from './loading-container';
import { Col, Row } from 'react-bootstrap';
import PaginatedResult from '@/interfaces/i-paginated-result';
import PaginationInfo from './pagination-info';
import { useTranslations } from 'next-intl';
import PaginationControls from './pagination-controls';
import Award from '@/interfaces/i-award';
import { useAwardsQuery } from '@/hooks/use-awards';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import AwardOptionsCard from './award-options-card';

const baseTPath = 'components.AwardsTable';

interface AwardsTableProps {
  initialAwards: PaginatedResult<Award>
}

const AwardsTable: React.FC<AwardsTableProps> = ({ initialAwards }) => {
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

  const { data, isPending, isError, isFetching, isSuccess } = useAwardsQuery(page, pageSize, initialAwards);

  const awards = data?.items ?? [];
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
          <Col>{t('failAwards')}</Col>
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
                itemName={t('awards')}
              />
          </Col>
        </Row>
      )}
      {awards && awards.length > 0 ? (
        awards.map((award, index) => (
          <Row key={index}>
            <Col>
              <AwardOptionsCard award={award} />
            </Col>
          </Row>
        ))
      ) : (
        <Row>
          <Col>{t('noAwards')}</Col>
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
                itemName={t('awards')}
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
            {t('refreshAwards')}
          </Col>
        </Row>
      )}
    </>
  )
}

export default AwardsTable;