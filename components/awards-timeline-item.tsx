"use client";
import React, { useState } from 'react';
import Award from "@/interfaces/i-award";
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import { useLocale, useTranslations } from 'next-intl';
import { LANG_EN } from '@/constants/common-vars';
import { motion, AnimatePresence } from "framer-motion";
import SanitizedHtml from './sanitized-html';
import "./awards-timeline-item.scss";
import AwardType from '@/enums/award-type';

const baseTPath = 'components.AwardsTimelineItem';

interface AwardsTimelineItemProps {
  award: Award;
  isFirst: boolean;
  isLast: boolean;
}

// Award Type Icons (Bootstrap Icons)
const AWARD_TYPE_ICONS: Record<AwardType, string> = {
  [AwardType.AWARD]: 'bi-trophy-fill',
  [AwardType.GRANT]: 'bi-cash-stack',
  [AwardType.FELLOWSHIP]: 'bi-mortarboard-fill',
  [AwardType.SCHOLARSHIP]: 'bi-book-fill',
  [AwardType.PRIZE]: 'bi-award-fill',
  [AwardType.RECOGNITION]: 'bi-patch-check-fill'
};

const AWARD_TYPE_COLORS: Record<AwardType, { gradient: string; shadow: string }> = {
  [AwardType.AWARD]: {
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    shadow: 'rgba(245, 158, 11, 0.4)'
  },
  [AwardType.GRANT]: {
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    shadow: 'rgba(16, 185, 129, 0.4)'
  },
  [AwardType.FELLOWSHIP]: {
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    shadow: 'rgba(59, 130, 246, 0.4)'
  },
  [AwardType.SCHOLARSHIP]: {
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    shadow: 'rgba(139, 92, 246, 0.4)'
  },
  [AwardType.PRIZE]: {
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    shadow: 'rgba(239, 68, 68, 0.4)'
  },
  [AwardType.RECOGNITION]: {
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    shadow: 'rgba(236, 72, 153, 0.4)'
  }
};

const AwardsTimelineItem: React.FC<AwardsTimelineItemProps> = ({award, isFirst, isLast}) => {
  const t = useTranslations(baseTPath);
  const [expanded, setExpanded] = useState(false);
  const locale = useLocale();

  // Extract localized content
  const title = locale === LANG_EN ? award.titleEn : award.titleSi;
  const description = locale === LANG_EN ? award.descriptionEn : award.descriptionSi;
  const issuer = locale === LANG_EN ? award.issuerEn : award.issuerSi;
  const issuerLocation = locale === LANG_EN ? award.issuerLocationEn : award.issuerLocationSi;
  const ceremonyLocation = locale === LANG_EN ? award.ceremonyLocationEn : award.ceremonyLocationSi;
  const coRecipients = locale === LANG_EN ? award.coRecipientsEn : award.coRecipientsSi;

  const iconClass = AWARD_TYPE_ICONS[award.type] || 'bi-trophy-fill';
  const typeColor = AWARD_TYPE_COLORS[award.type] || AWARD_TYPE_COLORS.AWARD;

  return (
    <Row className="awards-timeline-item">
      {/* Left Side: Timeline Spine (Dot + Line) */}
      <Col xs="auto" className="timeline-spine">
        {!isFirst && (
          <div className="line-container">
            <div className="line"></div>
            <div className="gap"></div>
          </div>
        )}

        {/* Dot */}
        <div
          className="dot"
          style={{
            background: typeColor.gradient,
            boxShadow: `0 4px 15px ${typeColor.shadow}`
          }}
        >
          <i className={iconClass}></i>
        </div>

        {/* Line (only if not last item) */}
        {!isLast && (
          <div className="line-container">
            <div className="gap"></div>
            <div className="line"></div>
          </div>
        )}
      </Col>

      {/* Right Side: Content Card */}
      <Col className="card-column">
        <Card className="award-card">
          <Card.Body>
            {/* Primary Info (Always Visible) */}
            <div className='primary-info'>
              {/* Badges Row */}
              <div className="badge-row">
                <Badge bg="primary">{award.year}</Badge>
                <Badge bg="secondary">{t(`awardCategory.${award.category}`)}</Badge>
                <Badge bg="secondary">{t(`awardScope.${award.scope}`)}</Badge>
                <Badge bg="secondary">{t(`awardResult.${award.result}`)}</Badge>
              </div>
              <h3>{title}</h3>
              <p className="issuer">{issuer}</p>
              {issuerLocation && (
                <p>
                  <i className="bi bi-geo-fill"></i> { issuerLocation }
                </p>
              )}
            </div>
            
            {/* Secondary Info (Expandable) */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                  className="secondary-info"
                >

                  { description && (
                    <SanitizedHtml html={description} className="ql-editor" />
                  )}

                  {ceremonyLocation && (
                    <div className="detail-row">
                      <i className="bi bi-geo-alt-fill"></i>
                      <span>{ceremonyLocation}</span>
                    </div>
                  )}

                  {award.monetaryValue && (
                    <div className="detail-row">
                      <i className="bi bi-cash"></i>
                      <span>{award.monetaryValue}</span>
                    </div>
                  )}

                  {coRecipients.length > 0 && (
                    <div className="detail-row">
                      <i className="bi bi-people-fill"></i>
                      <span>{t('coRecipients')}: {coRecipients.join(', ')}</span>
                    </div>
                  )}

                  <div className="link-buttons">
                    {award.eventUrl && (
                      <Button variant="outline-primary" size="sm" href={award.eventUrl} target="_blank">
                        <i className="bi bi-link-45deg"></i> {t('event')}
                      </Button>
                    )}
                    {award.relatedWorkUrl && (
                      <Button variant="outline-secondary" size="sm" href={award.relatedWorkUrl} target="_blank">
                        <i className="bi bi-file-earmark-text"></i> {t('relatedWork')}
                      </Button>
                    )}
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Button */}
            <Button
              variant="link"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="toggle-button"
            >
              {expanded ? (
                <>{t('showLess')} <i className="bi bi-chevron-up"></i></>
              ) : (
                <>{t('showMore')} <i className="bi bi-chevron-down"></i></>
              )}
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default AwardsTimelineItem;