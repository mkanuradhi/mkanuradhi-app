"use client";
import { Container } from "react-bootstrap";
import { useTranslations } from "next-intl";
import "./intro-section.scss";

const baseTPath = 'components.IntroSection';

const IntroSection = () => {
  const t = useTranslations(baseTPath);

  return (
    <section className="intro-section">
      <Container>
        <div className="intro-wrapper">
          <p className="intro-kicker">{t('title')}</p>
          <p className="intro-text lead">
            {t('introText')}
          </p>
        </div>
      </Container>
    </section>
  );
};

export default IntroSection;