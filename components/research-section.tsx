"use client";
import { Col, Row } from "react-bootstrap";
import { useTranslations } from "next-intl";
import resImage from "@/public/images/anu-research.png"
import Image from "next/image";
import "./research-section.scss";

const baseTPath = 'components.ResearchSection';

const ResearchSection = () => {
  const t = useTranslations(baseTPath);

  return (
    <section className="research-section">
      <Row className="align-items-center g-5">
        <Col xs={12} md={5}>
          <div className="research-photo-wrapper">
            <Image
              src={resImage}
              alt={`researcj image`}
              fill
              sizes="(max-width: 767px) 100vw, 420px"
              className="research-photo"
            />
          </div>
        </Col>
        <Col xs={12} md={7}>
          <p className="research-title">{t('title')}</p>
          <p className="research-text">{t('researchText')}</p>
        </Col>
      </Row>
    </section>
  );
};

export default ResearchSection;