"use client";
import { Col, Row } from "react-bootstrap";
import { useTranslations } from "next-intl";
import eduImage from "@/public/images/anu-education.png"
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import "./education-section.scss";

const baseTPath = 'components.EducationSection';

// Motion variants for the image
const imageVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

// Motion variants for the list container (controls stagger timing)
const listContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

// Motion variants for each individual list item
const listItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const EducationSection = () => {
  const t = useTranslations(baseTPath);
  const shouldReduceMotion = useReducedMotion();

  const qualifications = [
    { degree: t('phdDegree'), location: t('phdLocation'), "year": t('phdYear') },
    { degree: t('mscDegree'), location: t('mscLocation'), "year": t('mscYear') },
    { degree: t('bscDegree'), location: t('bscLocation'), "year": t('bscYear') },
  ];

  return (
    <section className="education-section">
      <Row className="align-items-stretch g-5">
        <Col xs={12} md={5} className="d-none d-md-block">
          <div className="education-image-wrapper">
            <motion.div
              initial={shouldReduceMotion ? undefined : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={shouldReduceMotion ? undefined : imageVariants}
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              <Image
                src={eduImage}
                alt={`Represents academic progression`}
                fill
                sizes="(max-width: 767px) 100vw, 420px"
                style={{ objectFit: "contain" }}
              />
            </motion.div>
          </div>
        </Col>
        <Col xs={12} md={7} className="">
          <p className="education-title">{t('title')}</p>
          <motion.div
            initial={shouldReduceMotion ? undefined : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={shouldReduceMotion ? undefined : listContainerVariants}
          >
            {qualifications.map((q) => (
              <motion.div
                key={q.degree}
                variants={shouldReduceMotion ? undefined : listItemVariants}
                className="label"
              >
                <span className="degree">{q.degree}</span>
                <span className="location-line">
                  <span className="location">{q.location}</span>
                  <span className="year">{q.year}</span>
                </span>
              </motion.div>
            ))}
          </motion.div>
        </Col>
      </Row>
    </section>
  );
};

export default EducationSection;