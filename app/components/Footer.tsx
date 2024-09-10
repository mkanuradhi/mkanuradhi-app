"use client";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from "uuid";
import { useMessages, useTranslations } from "next-intl";
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
          <Row>
            <Col sm={9}>
              <div className="fs-6">
                <p className="text-center">
                  {t('title', { currentYear: new Date().getFullYear() })}
                </p>
              </div>
            </Col>
            <Col sm={3}>
              <div className="fs-6 text-end">
                <Button variant="link" size="sm" className="blank-btn" onClick={handleShow}>{t('ackTitle')}</Button>
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