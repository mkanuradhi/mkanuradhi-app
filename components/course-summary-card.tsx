"use client";
import React, { useMemo } from 'react';
import { Card } from "react-bootstrap";
import { useTranslations } from 'next-intl';
import type { SummaryStat } from '@/interfaces/i-stat';
import { scaleOrdinal } from "d3-scale";
import { schemeTableau10 } from "d3-scale-chromatic";
import CountUpOnView from './count-up-on-view';

const baseTPath = 'components.CourseSummaryCard';

interface CourseSummaryCardProps {
  summary: SummaryStat;
}

const CourseSummaryCard: React.FC<CourseSummaryCardProps> = ({ summary }) => {
  const t = useTranslations(baseTPath);
  const total = summary.stats[0]?.value ?? 0;

  const byType = useMemo(
    () => (summary.grouped.byType ?? []).filter((s) => s.value > 0),
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
        <h6 className="text-muted fw-semibold text-center mb-0">
          {t("title")}
        </h6>

        <div className="text-center">
          <span className="display-3">
            <CountUpOnView end={total} duration={2} />
          </span>
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
                className="px-3 py-1 rounded-pill fs-9"
                style={{
                  border: `1px solid ${c}`,
                  color: c,
                }}
              >
                {t(`degreeType.${label}`, { default: label })}
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

export default CourseSummaryCard;