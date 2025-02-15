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
  if (totalCount === 0) return null;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min(startItem + currentPageSize - 1, totalCount);

  return (
    <span className="text-muted">
      {t('showing')} <strong>{startItem}</strong> - <strong>{endItem}</strong> {t('of')}{" "}
      <strong>{totalCount}</strong> {t('items')}{" "}{itemName} ({t('page')}{" "}
      <strong>{currentPage + 1}</strong> {t('pageOf')} <strong>{totalPages}</strong>)
    </span>
  );
}

export default PaginationInfo;