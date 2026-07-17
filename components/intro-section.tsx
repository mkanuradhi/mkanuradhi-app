"use client";
import { Col, Row } from "react-bootstrap";
import { useTranslations } from "next-intl";
import "./intro-section.scss";

const baseTPath = 'components.IntroSection';

const IntroSection = () => {
  const t = useTranslations(baseTPath);

  return (
    <section className="intro-section">
      <Row>
        <Col className="intro-wrapper">
          <p className="intro-kicker">{t('title')}</p>
          <p className="intro-text lead">
            {t('introText')}
          </p>
        </Col>
      </Row>
    </section>
  );
};

export default IntroSection;