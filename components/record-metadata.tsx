'use client';
import { LANG_SI, LOCALE_EN, LOCALE_SI } from "@/constants/common-vars";
import AppUser from "@/interfaces/i-app-user";
import { getFormattedDateTime } from "@/utils/common-utils";
import { faCalendarCheck, faCalendarPlus, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { Col, Row } from "react-bootstrap";
import { useLocale, useTranslations } from "next-intl";

const baseTPath = 'components.RecordMetadata';

interface RecordMetadataProps {
  createdAt?: Date;
  createdBy?: AppUser | null;
  updatedAt?: Date;
  updatedBy?: AppUser | null;
  className?: string;
}

const RecordMetadata: React.FC<RecordMetadataProps> = ({
  createdAt,
  createdBy,
  updatedAt,
  updatedBy,
  className = ''
}) => {
  const t = useTranslations(baseTPath);
  const lang = useLocale();
  const locale = lang === LANG_SI ? LOCALE_SI : LOCALE_EN;

  if (!createdAt && !updatedAt && !createdBy && !updatedBy) return null;

  const renderPicture = (user?: AppUser | null) => {
    if (!user) return null;
    return (
      <>
        {user.picture ? (
          <Image
            src={user.picture}
            alt={user.name ?? user.email ?? 'User'}
            width={28}
            height={28}
            className="meta-avatar rounded-circle"
          />
        ) : (
          <FontAwesomeIcon icon={faCircleUser} className="text-secondary" />
        )}
      </>
    );
  };

  return (
    <div className={`record-metadata ${className}`}>
      <Row>
        <Col xs={12}>
          <hr />
        </Col>
      </Row>
      <Row className="gx-4">
        {/* created by */}
        {createdBy && (
        <Col md={6} xs={12} className="mb-4">
          <Row>
            <Col xs={12} className="mb-3 small text-success">
              <FontAwesomeIcon icon={faCalendarPlus} className="me-2" />
              <span>{t('created')}</span>
            </Col>
            {createdBy.picture && (
            <Col xs={2} className="d-flex justify-content-center align-items-center">
              {renderPicture(createdBy)}
            </Col>
            )}
            <Col xs={10}>
              {createdBy.name && (
              <Row>
                <Col className="fw-bolder">
                  {createdBy.name}
                </Col>
              </Row>
              )}
              {createdBy.email && (
              <Row>
                <Col className="text-muted small">
                  <em>{createdBy.email}</em>
                </Col>
              </Row>
              )}
              {createdAt && (
              <Row>
                <Col>
                  {getFormattedDateTime(locale, createdAt)}
                </Col>
              </Row>
              )}
            </Col>
          </Row>
        </Col>
        )}
        {/* updated by */}
        {updatedBy && (
        <Col md={6} xs={12} className="mb-4">
          <Row>
            <Col xs={12} className="mb-3 small text-warning">
              <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
              <span>{t('updated')}</span>
            </Col>
            {updatedBy.picture && (
            <Col xs={2} className="d-flex justify-content-center align-items-center">
              {renderPicture(updatedBy)}
            </Col>
            )}
            <Col xs={10}>
              {updatedBy.name && (
              <Row>
                <Col className="fw-bolder">
                  {updatedBy.name}
                </Col>
              </Row>
              )}
              {updatedBy.email && (
              <Row>
                <Col className="text-muted small">
                  <em>{updatedBy.email}</em>
                </Col>
              </Row>
              )}
              {updatedAt && (
              <Row>
                <Col>
                  {getFormattedDateTime(locale, updatedAt)}
                </Col>
              </Row>
              )}
            </Col>
          </Row>
        </Col>
        )}
      </Row>
    </div>
  );
};

export default RecordMetadata;