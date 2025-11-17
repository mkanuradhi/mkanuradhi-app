"use client";
import { Alert, Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEnvelopeOpen, faEye, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useDeleteContactMessageMutation, useToggleReadContactMessageMutation } from '@/hooks/use-contact-messages';
import { FullContactMessage } from '@/interfaces/i-contact-message';
import DeleteModal from './delete-modal';
import { getFormattedDate } from '@/utils/common-utils';
import { LOCALE_EN } from '@/constants/common-vars';


const baseTPath = 'components.ContactMessageOptionsCard';

interface ContactMessageOptionsCardProps {
  contactMessage: FullContactMessage;
}

const ContactMessageOptionsCard: React.FC<ContactMessageOptionsCardProps> = ({contactMessage}) => {
  const t = useTranslations(baseTPath);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const { mutate: deleteContactMessageMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteContactMessageMutation();
  const { mutate: toggleReadContactMessageMutation, isPending: isPendingToggle, isError: isToggleError, error: toggleError } = useToggleReadContactMessageMutation();

  const handleDeleteContactMessage = async () => {
    deleteContactMessageMutation(contactMessage.id);
    setDeleteModalShow(false)
  }

  const handleToggle = () => {
    toggleReadContactMessageMutation(contactMessage.id);
  }

  return (
    <>
      <Card className="my-3 shadow contact-message-options-card">
        <Card.Body>
          {contactMessage.createdAt && (
            <Card.Subtitle className="my-2">
              <Row className="align-items-center">
                <Col>
                  <small>{ getFormattedDate(LOCALE_EN, contactMessage.createdAt) }</small>
                </Col>
              </Row>
            </Card.Subtitle>
          )}
          <Card.Title>
            { contactMessage.name }
          </Card.Title>
          <Row>
            <Col>
              <p>
                <label className="fw-semibold me-1">{t('fromEmail')}:</label>
                <span>{ contactMessage.email }</span>
              </p>
            </Col>
          </Row>
          <div className="mb-3">
            { contactMessage.message }
          </div>
          <hr />
          <div>
            <Row>
              <Col xs={12} md={4}>
                <p>
                  <label className="fw-semibold me-1">{t('ip')}:</label>
                  <span>{ contactMessage.ipAddress }</span>
                </p>
              </Col>
              <Col>
                <p>
                  <label className="fw-semibold me-1">{t('userAgent')}:</label>
                  <span>{ contactMessage.userAgent }</span>
                </p>
              </Col>
            </Row>
            {(contactMessage.browser || contactMessage.screen) && (
              <Row>
                <Col xs={12} md={4}>
                  <p>
                    <label className="fw-semibold me-1">{t('browser')}:</label>
                    <span>{ contactMessage.browser }</span>
                  </p>
                </Col>
                <Col>
                  <p>
                    <label className="fw-semibold me-1">{t('screen')}:</label>
                    <span>{ contactMessage.screen }</span>
                  </p>
                </Col>
              </Row>
            )}
            {(contactMessage.timezone || contactMessage.language) && (
              <Row>
                <Col xs={12} md={4}>
                  <p>
                    <label className="fw-semibold me-1">{t('timezone')}:</label>
                    <span>{ contactMessage.timezone }</span>
                  </p>
                </Col>
                <Col>
                  <p>
                    <label className="fw-semibold me-1">{t('language')}:</label>
                    <span>{ contactMessage.language }</span>
                  </p>
                </Col>
              </Row>
            )}
            {(contactMessage.city || contactMessage.country) && (
              <Row>
                <Col xs={12} md={4}>
                  <p>
                    <label className="fw-semibold me-1">{t('city')}:</label>
                    <span>{ contactMessage.city }</span>
                  </p>
                </Col>
                <Col>
                  <p>
                    <label className="fw-semibold me-1">{t('country')}:</label>
                    <span>{ contactMessage.country }</span>
                  </p>
                </Col>
              </Row>
            )}
            {(contactMessage.latitude || contactMessage.longitude) && (
              <Row>
                <Col xs={12} md={4}>
                  <p>
                    <label className="fw-semibold me-1">{t('latitude')}:</label>
                    <span>{ contactMessage.latitude }</span>
                  </p>
                </Col>
                <Col>
                  <p>
                    <label className="fw-semibold me-1">{t('longitude')}:</label>
                    <span>{ contactMessage.longitude }</span>
                  </p>
                </Col>
              </Row>
            )}
            {(contactMessage.os || contactMessage.deviceType) && (
              <Row>
                <Col xs={12} md={4}>
                  <p>
                    <label className="fw-semibold me-1">{t('os')}:</label>
                    <span>{ contactMessage.os }</span>
                  </p>
                </Col>
                <Col>
                  <p>
                    <label className="fw-semibold me-1">{t('deviceType')}:</label>
                    <span>{ contactMessage.deviceType }</span>
                  </p>
                </Col>
              </Row>
            )}
          </div>
          <Row className="align-items-center">
            <Col className="mb-2">
              <ButtonGroup>
                <Button
                  variant={contactMessage.isRead === true ? `secondary` : `success`}
                  aria-label={contactMessage.isRead === true ? t('markAsUnread') : t('markAsRead')}
                  onClick={handleToggle}
                  disabled={isPendingToggle}
                >
                  <FontAwesomeIcon
                    icon={contactMessage.isRead === true ? faEnvelope : faEnvelopeOpen}
                    className="me-sm-1"
                  />
                  <span className="d-none d-sm-inline">
                    {contactMessage.isRead === true ? t('markAsUnread') : t('markAsRead')}
                  </span>
                </Button>
              </ButtonGroup>
            </Col>
            <Col xs="auto" className="mb-2">
              <Button
                variant="danger"
                aria-label={t('delete')}
                className="me-2 my-1"
                onClick={() => setDeleteModalShow(true)}
                disabled={isPendingDelete}
              >
                <FontAwesomeIcon icon={faTrash} className="me-sm-1" />
                <span className="d-none d-sm-inline">{t('delete')}</span>
              </Button>
            </Col>
          </Row>
          {isToggleError && toggleError && (
            <Alert variant="danger" className="my-2" dismissible>
              <Alert.Heading>{t('toggleErrorTitle')}</Alert.Heading>
              <p>{toggleError.message}</p>
            </Alert>
          )}
          {isDeleteError && deleteError && (
            <Alert variant="danger" className="my-2" dismissible>
              <Alert.Heading>{t('deleteErrorTitle')}</Alert.Heading>
              <p>{deleteError.message}</p>
            </Alert>
          )}
        </Card.Body>
      </Card>
      <DeleteModal
        title={t('deleteModalTitle')}
        description={
          t.rich('deleteModalMessage', {
            strong: () => <strong>{contactMessage.name}</strong>,
          })
        }
        cancelText={t('deleteModalCancel')}
        confirmText={t('deleteModalAccept')}
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        onConfirm={handleDeleteContactMessage}
      />
    </>
  )
}

export default ContactMessageOptionsCard;