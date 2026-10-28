"use client";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { LocalizedSummaryMediaContribution } from "@/interfaces/i-media-contribution";
import { useTranslations } from "next-intl";
import { Card, Col, Row } from "react-bootstrap";
import { motion } from "framer-motion";
import './media-contribution-featured-card.scss';

const baseTPath = 'components.MediaContributionFeaturedCard';

interface MediaContributionFeaturedCardProps {
  lsMediaContribution: LocalizedSummaryMediaContribution;
}

const MediaContributionFeaturedCard: React.FC<MediaContributionFeaturedCardProps> = ({lsMediaContribution}) => {
  const t = useTranslations(baseTPath);

  return (
    <motion.div
      className="media-contribution-featured-card"
      whileHover={{
        scale: 1.01,
        boxShadow: '0px 12px 30px rgba(var(--bs-body-color-rgb), 0.2)'
      }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
    >
      <Card>
        <Row className="g-0">
          <Col md={6} className="fmc-media">
            {lsMediaContribution.coverImage ? (
              <Image
                src={lsMediaContribution.coverImage}
                alt={lsMediaContribution.titleOriginal}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="fmc-media-img"
                priority
              />
            ) : (
              <span className="fmc-media-fallback">{lsMediaContribution.outlet?.name}</span>
            )}
          </Col>

          <Col md={6}>
            <Card.Body className="fmc-panel">
              <span className="fmc-flag">{t('featured')}</span>
              <span className="fmc-meta">
                {lsMediaContribution.outlet?.name} · {lsMediaContribution.publishedDateFormatted}
              </span>
              <Card.Title as="h2" className="fmc-title">{lsMediaContribution.titleOriginal}</Card.Title>
              { lsMediaContribution.subtitleOriginal && 
                <Card.Subtitle as="p" className="fmc-subtitle">{lsMediaContribution.subtitleOriginal}</Card.Subtitle>
              }
              <Card.Text className="fmc-description">{lsMediaContribution.description}</Card.Text>
              <Link href={`/media-contributions/${lsMediaContribution.path}`} className="fmc-cta">{t('readMore')} →</Link>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </motion.div>
  );

}

export default MediaContributionFeaturedCard;
