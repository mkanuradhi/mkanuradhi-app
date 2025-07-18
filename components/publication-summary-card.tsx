"use client";
import React, { useMemo } from 'react';
import { Card } from "react-bootstrap";
import { useTranslations } from 'next-intl';
import type { SummaryStat } from '@/interfaces/i-stat';
import { scaleOrdinal } from "d3-scale";
import { schemeTableau10 } from "d3-scale-chromatic";

const baseTPath = 'components.PublicationSummaryCard';

interface PublicationSummaryCardProps {
  summary: SummaryStat;
}

const PublicationSummaryCard: React.FC<PublicationSummaryCardProps> = ({ summary }) => {
  const t = useTranslations(baseTPath);
  const total = summary.stats[0]?.value ?? 0;

  const byType = useMemo(
    () => summary.grouped.byType ?? [],
    [summary.grouped.byType]
  );

  const colour = useMemo(
    () =>
      scaleOrdinal<string, string>()
        .domain(byType.map(({ label }) => label))
        .range(schemeTableau10),
    [byType]
  );

  return (
    <Card className="shadow-sm">
      
      <Card.Body>
        <h5 className="text-muted fw-semibold text-center mb-0">
          {t("title")}
        </h5>

        <div className="text-center">
          <span className="display-1">{total}</span>
        </div>
      </Card.Body>

      <hr className="my-0" />

      <Card.Body className="d-flex flex-column gap-1">
        <div className="d-flex flex-wrap justify-content-center gap-2 pt-1">
          {byType.map(({ label, value }) => {
            const c = colour(label);
            return (
              <span
                key={label}
                className="px-3 py-1 rounded-pill small"
                style={{
                  border: `1px solid ${c}`,
                  color: c,
                }}
              >
                {t(`publicationType.${label}`, { default: label })}
                &nbsp;·&nbsp;
                <strong>{value}</strong>
              </span>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

export default PublicationSummaryCard;