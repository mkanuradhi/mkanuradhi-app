"use client";
import { useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslations } from "next-intl";
import resImage from "@/public/images/anu-research.png"
import Image from "next/image";
import { motion, useReducedMotion, Variants } from "framer-motion";
import "./research-section.scss";

const baseTPath = 'components.ResearchSection';

const ResearchSection = () => {
  const t = useTranslations(baseTPath);
  const shouldReduceMotion = useReducedMotion();

  const imageVariants: Variants = useMemo(() => ({
      hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.92 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    }), [shouldReduceMotion]);

  const textVariants: Variants = useMemo(() => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.15 },
    },
  }), [shouldReduceMotion]);

  return (
    <section className="research-section">
      <Row className="align-items-center g-5">
        <Col xs={12} md={5}>
          <motion.div
            className="research-photo-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={imageVariants}
          >
            <Image
              src={resImage}
              alt={`research image`}
              fill
              sizes="(max-width: 767px) 100vw, 420px"
              className="research-photo"
            />
          </motion.div>
        </Col>
        <Col xs={12} md={7}>
          <motion.div
            className="research-text-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textVariants}
          >
            <p className="research-title">{t('title')}</p>
            <p className="research-text lead">{t('researchText')}</p>
          </motion.div>
        </Col>
      </Row>
    </section>
  );
};

export default ResearchSection;