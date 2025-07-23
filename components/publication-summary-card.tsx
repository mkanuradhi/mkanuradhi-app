"use client";
import React, { useMemo, useState } from "react";
import { Card, Collapse, Row, Col, Button } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { scaleOrdinal } from "d3-scale";
import { schemeTableau10 } from "d3-scale-chromatic";
import CountUpOnView from "./count-up-on-view";
import type { SummaryStat } from "@/interfaces/i-stat";

const baseTPath = "components.PublicationSummaryCard";

interface Props {
  summary: SummaryStat;
}

const PublicationSummaryCard: React.FC<Props> = ({ summary }) => {
  const t = useTranslations(baseTPath);
  const [open, setOpen] = useState(false);

  const total = summary.stats[0]?.value ?? 0;
  const byType = useMemo(() => summary.grouped.byType ?? [], [summary.grouped.byType]);

  const colour = useMemo(
    () =>
      scaleOrdinal<string, string>()
        .domain(byType.map(({ label }) => label))
        .range(schemeTableau10),
    [byType]
  );

  return (
    <Card className="shadow-sm">
      <Card.Body className="py-2">
        <Row className="align-items-center g-0">
          {/* fixed-width number column */}
          <Col
            xs="auto"
            className="text-center"
          >
            <span className="display-5 mb-0">
              <CountUpOnView end={total} duration={1.8} reserveSpace={true} />
            </span>
          </Col>
          {/* title column */}
          <Col className="text-muted fw-semibold ps-3">
            {t("title")}
          </Col>
          {/* toggle button for details */}
          {byType.length > 0 && (
            <Col xs="auto">
              <Button
                variant="link"
                size="sm"
                className="p-0 text-muted"
                aria-expanded={open}
                aria-controls="pub-details"
                onClick={() => setOpen(v => !v)}
                style={{ textDecoration: "none", fontSize: "1.25rem" }}
              >
                &hellip;
              </Button>
            </Col>
          )}
        </Row>
      </Card.Body>

      {/* Details section */}
      <Collapse in={open}>
        <div>
          <hr className="my-0 opacity-25" />
          <Card.Body className="d-flex flex-wrap justify-content-center gap-2 py-3">
            {byType.map(({ label, value }) => {
              const c = colour(label);
              return (
                <span
                  key={label}
                  className="px-3 py-1 rounded-pill fw-semibold fs-9"
                  style={{ border: `1px solid ${c}`, color: c }}
                >
                  {t(`publicationType.${label}`, { default: label })}&nbsp;·&nbsp;
                  {value}
                </span>
              );
            })}
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
};

export default PublicationSummaryCard;