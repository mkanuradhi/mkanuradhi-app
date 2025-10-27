"use client";
import { Button, Col, Container, Modal, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from "uuid";
import { useMessages, useTranslations } from "next-intl";
import GlowLink from "./GlowLink";
import { motion } from 'framer-motion';
import "./Footer.scss";

interface DescriptionMessages {
  components: {
    Footer: {
      ackDescriptions: string[];
    };
  };
}

export const Footer = () => {
  const t = useTranslations('components.Footer');

  const descriptionMessages = useMessages() as unknown as DescriptionMessages | undefined;
  const descriptions = descriptionMessages?.components?.Footer?.ackDescriptions as string[];

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="footer-bar">
        <Container fluid="md">
          <Row style={{ minHeight: '4rem' }}>
            <Col sm={9} className="d-flex justify-content-center align-items-center">
              <div className="text-center">
                <span>{t('title', { currentYear: new Date().getFullYear() })} </span>
                <GlowLink href="/policy">{t('policy')}</GlowLink>
              </div>
            </Col>
            <Col sm={3} className="d-flex justify-content-center align-items-center">
              <div>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-heart">{t('ackTitle')}</Tooltip>}
                trigger={['hover', 'focus']}
              >
                <Button
                  variant="link"
                  size="sm"
                  className="blank-btn"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    handleShow();
                  }}
                  aria-label={t('ackTitle')}
                >
                  <motion.svg
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    initial={{ strokeDashoffset: 300, fill: "transparent" }}
                    animate={{
                      strokeDashoffset: [300, 0],
                      transition: {
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      },
                    }}
                    whileHover={{
                      fill: "var(--bs-danger)",
                      stroke: "var(--bs-danger)",
                      strokeDashoffset: [0],
                      transition: {
                        duration: 0.5,
                        ease: 'easeInOut',
                      }
                    }}
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray="300"
                  >
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--bs-primary)" />
                        <stop offset="100%" stopColor="var(--bs-danger)" />
                      </linearGradient>
                    </defs>
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </motion.svg>
                </Button>
                </OverlayTrigger>
              </div>
            </Col>
          </Row>
        </Container>
        <Modal show={show} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('ackTitle')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {descriptions.map(description => (
              <p key={uuidv4()} style={{textAlign: "justify"}}>{description}</p>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} size="sm">
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}
