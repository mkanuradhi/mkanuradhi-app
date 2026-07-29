"use client";
import { useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, Variants } from "framer-motion";
import "./intro-section.scss";

const baseTPath = 'components.IntroSection';

const IntroSection = () => {
  const t = useTranslations(baseTPath);
  const shouldReduceMotion = useReducedMotion();

  const textVariants: Variants = useMemo(() => ({
      hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut", delay: 0.15 },
      },
    }), [shouldReduceMotion]);

  return (
    <section className="intro-section">
      <Row>
        <Col>
          <motion.div
            className="intro-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textVariants}
          >
            <p className="intro-kicker">{t('title')}</p>
            <p className="intro-text lead">
              {t('introText')}
            </p>
          </motion.div>
        </Col>
      </Row>
    </section>
  );
};

export default IntroSection;