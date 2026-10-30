"use client";
import { useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, Variants } from "framer-motion";
import AnimatedLink from "./animated-link";
import "./connect-section.scss";

const baseTPath = 'components.ConnectSection';

const ConnectSection = () => {
  const t = useTranslations(baseTPath);
  const shouldReduceMotion = useReducedMotion();

  const textVariants: Variants = useMemo(() => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }), [shouldReduceMotion]);

  return (
    <section className="connect-section" aria-labelledby="connect-title">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <motion.div
            className="connect-text-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textVariants}
          >
            <h2 id="connect-title" className="connect-title">{t('title')}</h2>
            <p className="connect-text lead">{t('text')}</p>
            <AnimatedLink href="/contact" className="mt-4">
              {t('cta')}
            </AnimatedLink>
          </motion.div>
        </Col>
      </Row>
    </section>
  );
};

export default ConnectSection;
