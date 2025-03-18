import { useTranslations } from 'next-intl';
import React from 'react';

const baseTPath = 'components.PaginationInfo';

interface PaginationInfoProps {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: number;
  pageSize: number;
  itemName?: string;
}

const PaginationInfo: React.FC<PaginationInfoProps> = ({
  totalCount,
  totalPages,
  currentPage,
  currentPageSize,
  pageSize,
  itemName = ""
}) => {
  const t = useTranslations(baseTPath);

  // Avoid showing pagination info when there's no data
  if (totalCount === 0 || currentPageSize === 0) return null;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min(startItem + currentPageSize - 1, totalCount);
  const contentName = itemName || t('noItemName');

  return (
    <span className="text-muted">
      {
        t.rich('itemInfo', {
          strong: (chunks) => <strong>{chunks}</strong>,
          startItem,
          endItem,
          totalCount,
          itemName: contentName,
          })
      }
      {" "}
      {
        t.rich('pageInfo', {
          strong: (chunks) => <strong>{chunks}</strong>,
          currentPage: currentPage + 1,
          totalPages
        })
      }
    </span>
  );
}

export default PaginationInfo;