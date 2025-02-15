import React from 'react';
import { Pagination } from 'react-bootstrap';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <>
      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />

        {/* Show first page if not already visible */}
        {currentPage > 2 && (
          <>
            <Pagination.Item onClick={() => handlePageChange(0)}>1</Pagination.Item>
            {currentPage > 3 && totalPages > 5 && <Pagination.Ellipsis />}
          </>
        )}

        {/* Show 5 nearby pages dynamically */}
        {Array.from({ length: 5 })
          .map((_, i) => currentPage - 2 + i)
          .filter((p) => p >= 0 && p < totalPages)
          .map((p) => (
            <Pagination.Item key={p} active={p === currentPage} onClick={() => handlePageChange(p)}>
              {p + 1}
            </Pagination.Item>
          ))
        }

        {/* Show last page if not already visible */}
        {currentPage < totalPages - 3 && totalPages > 5 && (
          <>
            <Pagination.Ellipsis />
            <Pagination.Item onClick={() => handlePageChange(totalPages - 1)}>{totalPages}</Pagination.Item>
          </>
        )}

        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        />
        <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage >= totalPages - 1} />
      </Pagination>
    </>
  )
}

export default PaginationControls;