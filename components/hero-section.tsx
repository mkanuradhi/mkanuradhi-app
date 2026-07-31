"use client";
import { Col, Row } from "react-bootstrap";
import MovingGradientTitle from "./moving-gradient-title";
import { useTranslations } from "next-intl";
import ExternalLinkBar from "./ExternalLinkBar";
import { faGoogleScholar, faLinkedin, faOrcid, faResearchgate } from '@fortawesome/free-brands-svg-icons';
import ScopusIcon from "@/icons/ScopusIcon";
import WebOfScienceIcon from "@/icons/WebOfScienceIcon";
import Image from "next/image";
import anuImage from "@/public/images/anuradha.jpg"
import "./hero-section.scss";

const baseTPath = 'components.HeroSection';


const HeroSection = () => {
  const t = useTranslations(baseTPath);

  const externalLinks = [
    {
      tooltipText: `${t('gsTooltip')}`,
      url: 'https://scholar.google.com/citations?user=-O25soMAAAAJ',
      faIcon: faGoogleScholar,
    },
    {
      tooltipText: `${t('liTooltip')}`,
      url: 'https://www.linkedin.com/in/anuradha-ariyaratne-3a406281/',
      faIcon: faLinkedin,
    },
    {
      tooltipText: `${t('oiTooltip')}`,
      url: 'https://orcid.org/0000-0002-3548-3976',
      faIcon: faOrcid,
    },
    {
      tooltipText: `${t('rgTooltip')}`,
      url: 'https://www.researchgate.net/profile/Anuradha-Ariyaratne',
      faIcon: faResearchgate,
    },
    {
      tooltipText: `${t('scTooltip')}`,
      url: 'https://www.scopus.com/authid/detail.uri?authorId=57188855115',
      customIcon: <ScopusIcon size={30} />,
    },
    {
      tooltipText: `${t('wsTooltip')}`,
      url: 'https://www.webofscience.com/wos/author/record/NRY-6429-2025',
      customIcon: <WebOfScienceIcon size={30} />,
    },
  ];

  return (
    <section className="hero-section">
      <Row className="align-items-center g-5">
        <Col xs={12} md={7} className="text-center order-2 order-md-1">
          <MovingGradientTitle text={t('heroName')} className="hero-animate hero-name" />
          <p className="text-center fs-5 mb-1 hero-animate hero-designation">{t('designation')}</p>
          <p className="text-center text-muted mb-3 hero-animate hero-university">
            <a href="https://www.sjp.ac.lk/" target="_blank" rel="noopener noreferrer" className="university-link">
              {t('university')}
            </a>
          </p>
          <p className="text-center fst-italic hero-subtext mb-4 hero-animate hero-tagline">{t('tagline')}</p>
          <div className="hero-animate hero-links">
            <ExternalLinkBar links={externalLinks} />
          </div>
        </Col>

        <Col xs={12} md={5} className="order-1 order-md-2">
          <div className="hero-photo-wrapper">
            <Image
              src={anuImage}
              alt={t('heroName')}
              fill
              sizes="(max-width: 767px) 100vw, 420px"
              className="hero-photo"
              priority
            />
          </div>
        </Col>
      </Row>
    </section>
  );
}

export default HeroSection;