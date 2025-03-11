"use client";
import React, { useState } from 'react';
import LoadingContainer from './loading-container';
import { Col, Row } from 'react-bootstrap';
import PaginatedResult from '@/interfaces/i-paginated-result';
import PaginationInfo from './pagination-info';
import { useTranslations } from 'next-intl';
import PaginationControls from './pagination-controls';
import Course from '@/interfaces/i-course';
import { useCoursesQuery } from '@/hooks/use-courses';
import CourseOptionsCard from './course-options-card';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

const baseTPath = 'components.CoursesTable';

interface CoursesTableProps {
  initialCourses: PaginatedResult<Course>
}

const CoursesTable: React.FC<CoursesTableProps> = ({ initialCourses }) => {
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

  const { data, isPending, isError, isFetching, isSuccess } = useCoursesQuery(page, pageSize, initialCourses);

  const courses = data?.items ?? [];
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
          <Col>{t('failCourses')}</Col>
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
                itemName={t('courses')}
              />
          </Col>
        </Row>
      )}
      {courses && courses.length > 0 ? (
        courses.map((course, index) => (
          <Row key={index}>
            <Col>
              <CourseOptionsCard course={course} />
            </Col>
          </Row>
        ))
      ) : (
        <Row>
          <Col>{t('noCourses')}</Col>
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
                itemName={t('courses')}
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
            {t('refreshCourses')}
          </Col>
        </Row>
      )}
    </>
  )
}

export default CoursesTable;