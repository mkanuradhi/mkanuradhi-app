"use client";
import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useActivateAwardMutation, useAwardByIdQuery, useDeactivateAwardMutation, useDeleteAwardMutation } from '@/hooks/use-awards';
import LoadingContainer from './loading-container';
import { Alert, Breadcrumb, Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import AwardType from '@/enums/award-type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faCertificate, faEye, faEyeSlash, faGift, faGraduationCap, faMoneyCheckDollar, faPen, faPeopleGroup, faTrash } from '@fortawesome/free-solid-svg-icons';
import DocumentStatus from '@/enums/document-status';
import DeleteModal from './delete-modal';
import { getFormattedDate } from '@/utils/common-utils';
import { LANG_SI, LOCALE_EN, LOCALE_SI } from '@/constants/common-vars';
import GlowLink from './GlowLink';
import Image from 'next/image';
import RecordMetadata from './record-metadata';
import "./award-options-viewer.scss";
import SanitizedHtml from './sanitized-html';

const baseTPath = 'components.AwardOptionsViewer';

interface AwardOptionsViewerProps {
  awardId: string;
}

const AwardOptionsViewer: React.FC<AwardOptionsViewerProps> = ({ awardId }) => {
  const t = useTranslations(baseTPath);
  const lang = useLocale();
  const locale = lang === LANG_SI ? LOCALE_SI : LOCALE_EN;
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const router = useRouter();

  const { data: award, isPending, isError, isFetching, error: awardError } = useAwardByIdQuery(awardId);
  const { mutate: deleteAwardMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteAwardMutation();
  const { mutate: activateAwardMutation, isPending: isPendingActivate, isError: isActivateError, error: activateError } = useActivateAwardMutation();
  const { mutate: deactivateAwardMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivateAwardMutation();

  if (isPending || isFetching) {
    return (<LoadingContainer />);
  }

  if (isError && awardError) {
    return (
      <Row>
        <Col>
          <h5>{t('failAward')}</h5>
          <p>{awardError.message}</p>
        </Col>
      </Row>
    );
  }

  const selectedTitle = 
    lang === LANG_SI 
      ? `${award.year ? award.year + " " : ""}'${award.titleSi ? award.titleSi : award.titleEn}'` 
      : `${award.year ? award.year + " " : ""}'${award.titleEn}'`;

  const handleDeleteAward = async () => {
    deleteAwardMutation(award.id);
    setDeleteModalShow(false);
    router.replace('/dashboard/awards');
  }

  const handleActivate = () => {
    activateAwardMutation(award.id);
  }

  const handleDeactivate = () => {
    deactivateAwardMutation(award.id);
  }

  const getTypeIcon = () => {
      switch (award.type) {
        case AwardType.AWARD:
          return <FontAwesomeIcon icon={faAward} className="text-primary" />;
        case AwardType.GRANT:
          return <FontAwesomeIcon icon={faMoneyCheckDollar} className="text-success" />;
        case AwardType.FELLOWSHIP:
          return <FontAwesomeIcon icon={faPeopleGroup} className="text-warning" />;
        case AwardType.SCHOLARSHIP:
          return <FontAwesomeIcon icon={faGraduationCap} className="text-danger" />;
        case AwardType.PRIZE:
          return <FontAwesomeIcon icon={faGift} className="text-info" />;
        case AwardType.RECOGNITION:
          return <FontAwesomeIcon icon={faCertificate} className="text-secondary" />;
        default:
          return null;
      }
    };

  return (
    <>
      <div className="award-options-viewer">
        <Row>
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item linkAs="span">
                <Link href="/dashboard">{t('dashboard')}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs="span">
                <Link href="/dashboard/awards">{t('awards')}</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        {/* ----------------- En ----------------- */}
        <Row className="my-2">
          <Col>
            <Row>
              <Col>
                <span>{award.year}</span>
              </Col>
              <Col xs="auto">
                <span className="me-2">{t(`awardType.${award.type.toLowerCase()}`)}</span>
                {getTypeIcon()}
              </Col>
            </Row>
            <Row>
              <Col>
                <h1>{ award.titleEn }</h1>
              </Col>
            </Row>
            <hr />
            {award.primaryImage && (
              <Row className="mb-3">
                <Col>
                  <div className="primary-image-wrapper">
                    <Image
                      src={award.primaryImage}
                      alt={award.titleEn}
                      fill={true}
                      className="primary-image"
                      priority={true}
                    />
                  </div>
                </Col>
              </Row>
            )}
            {award.issuerImage && (
              <Row className="mb-3">
                <Col>
                  <div className="primary-image-wrapper">
                    <Image
                      src={award.issuerImage}
                      alt={award.issuerEn}
                      width={200}
                      height={200}
                    />
                  </div>
                </Col>
              </Row>
            )}
            <Row className="my-4">
              <Col md={3}>
                <label className="fw-semibold me-1">{t('role')}:</label>
                <span>{ award.role }</span>
              </Col>
              <Col md={3}>
                <label className="fw-semibold me-1">{t('result')}:</label>
                <span>{ award.result }</span>
              </Col>
              <Col md={3}>
                <label className="fw-semibold me-1">{t('scope')}:</label>
                <span>{ award.scope }</span>
              </Col>
              <Col md={3}>
                <label className="fw-semibold me-1">{t('category')}:</label>
                <span>{ award.category }</span>
              </Col>
            </Row>
            {award.descriptionEn && (
              <Row>
                <Col>
                  <SanitizedHtml html={award.descriptionEn} />
                </Col>
              </Row>
            )}
            <Row className="my-4">
              <Col md={6}>
                <label className="fw-semibold me-1">{t('issuer')}:</label>
                <span>{ award.issuerEn }</span>
              </Col>
              <Col md={6}>
                <label className="fw-semibold me-1">{t('issuerLocation')}:</label>
                <span>{ award.issuerLocationEn }</span>
              </Col>
              <Col md={6}>
                <label className="fw-semibold me-1">{t('ceremonyLocation')}:</label>
                <span>{ award.ceremonyLocationEn }</span>
              </Col>
            </Row>
            {award.coRecipientsEn && award.coRecipientsEn.length > 0 && (
              <Row className="my-4">
                <Col sm={12}>
                  <h5>{t('coRecipients')}</h5>
                </Col>
                {award.coRecipientsEn.map((recipient, index) => (
                  <Col md={4} key={index}>
                    <label className="fw-semibold me-1">{index + 1}. </label>
                    <span>{ recipient }</span>
                  </Col>
                ))}
              </Row>
            )}
            { award.eventUrl && (
              <Row>
                <Col>
                  <label className="fw-semibold me-1">{t('eventUrl')}:</label>
                  <GlowLink href={award.eventUrl} newTab={true} withArrow={true}>{award.eventUrl}</GlowLink>
                </Col>
              </Row>
            )}
            { award.relatedWorkUrl && (
              <Row>
                <Col>
                  <label className="fw-semibold me-1">{t('relatedWorkUrl')}:</label>
                  <GlowLink href={award.relatedWorkUrl} newTab={true} withArrow={true}>{award.relatedWorkUrl}</GlowLink>
                </Col>
              </Row>
            )}
            { award.monetaryValue && (
              <Row>
                <Col>
                  <label className="fw-semibold me-1">{t('monetaryValue')}:</label>
                  <span>{ award.monetaryValue }</span>
                </Col>
              </Row>
            )}
            {award.receivedDate && (
              <Row>
                <Col>
                  <p>
                    <label className="fw-semibold me-1">{t('receivedDate')}:</label>
                    <span>{ getFormattedDate(locale, award.receivedDate) }</span>
                  </p>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        {/* ----------------- Si ----------------- */}
        <Row className="mt-4">
          <Col>
            <Row>
              <Col>
                <span>{award.year}</span>
              </Col>
              <Col xs="auto">
                <span className="me-2">{t(`awardType.${award.type.toLowerCase()}`)}</span>
                {getTypeIcon()}
              </Col>
            </Row>
            <Row>
              <Col>
                <h1>{ award.titleSi }</h1>
              </Col>
            </Row>
            <hr />
            {award.primaryImage && (
              <Row className="mb-3">
                <Col>
                  <div className="primary-image-wrapper">
                    <Image
                      src={award.primaryImage}
                      alt={award.titleSi}
                      fill={true}
                      className="primary-image"
                      priority={true}
                    />
                  </div>
                </Col>
              </Row>
            )}
            {award.issuerImage && (
              <Row className="mb-3">
                <Col>
                  <div className="primary-image-wrapper">
                    <Image
                      src={award.issuerImage}
                      alt={award.issuerSi}
                      width={200}
                      height={200}
                    />
                  </div>
                </Col>
              </Row>
            )}
            <Row className="my-4">
              <Col md={3}>
                <label className="fw-semibold me-1">{t('role')}:</label>
                <span>{ award.role }</span>
              </Col>
              <Col md={3}>
                <label className="fw-semibold me-1">{t('result')}:</label>
                <span>{ award.result }</span>
              </Col>
              <Col md={3}>
                <label className="fw-semibold me-1">{t('scope')}:</label>
                <span>{ award.scope }</span>
              </Col>
              <Col md={3}>
                <label className="fw-semibold me-1">{t('category')}:</label>
                <span>{ award.category }</span>
              </Col>
            </Row>
            {award.descriptionSi && (
              <Row>
                <Col>
                  <SanitizedHtml html={award.descriptionSi} />
                </Col>
              </Row>
            )}
            <Row className="my-4">
              <Col md={6}>
                <label className="fw-semibold me-1">{t('issuer')}:</label>
                <span>{ award.issuerSi }</span>
              </Col>
              <Col md={6}>
                <label className="fw-semibold me-1">{t('issuerLocation')}:</label>
                <span>{ award.issuerLocationSi }</span>
              </Col>
              <Col md={6}>
                <label className="fw-semibold me-1">{t('ceremonyLocation')}:</label>
                <span>{ award.ceremonyLocationSi }</span>
              </Col>
            </Row>
            {award.coRecipientsSi && award.coRecipientsSi.length > 0 && (
              <Row className="my-4">
                <Col sm={12}>
                  <h5>{t('coRecipients')}</h5>
                </Col>
                {award.coRecipientsSi.map((recipient, index) => (
                  <Col md={4} key={index}>
                    <label className="fw-semibold me-1">{index + 1}. </label>
                    <span>{ recipient }</span>
                  </Col>
                ))}
              </Row>
            )}
            { award.eventUrl && (
              <Row>
                <Col>
                  <label className="fw-semibold me-1">{t('eventUrl')}:</label>
                  <GlowLink href={award.eventUrl} newTab={true} withArrow={true}>{award.eventUrl}</GlowLink>
                </Col>
              </Row>
            )}
            { award.relatedWorkUrl && (
              <Row>
                <Col>
                  <label className="fw-semibold me-1">{t('relatedWorkUrl')}:</label>
                  <GlowLink href={award.relatedWorkUrl} newTab={true} withArrow={true}>{award.relatedWorkUrl}</GlowLink>
                </Col>
              </Row>
            )}
            { award.monetaryValue && (
              <Row>
                <Col>
                  <label className="fw-semibold me-1">{t('monetaryValue')}:</label>
                  <span>{ award.monetaryValue }</span>
                </Col>
              </Row>
            )}
            {award.receivedDate && (
              <Row>
                <Col>
                  <p>
                    <label className="fw-semibold me-1">{t('receivedDate')}:</label>
                    <span>{ getFormattedDate(locale, award.receivedDate) }</span>
                  </p>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        {/* ----------------- metadata ----------------- */}
        <RecordMetadata createdAt={award.createdAt} createdBy={award.createdBy} updatedAt={award.updatedAt} updatedBy={award.updatedBy} />
        {/* ----------------- common buttons ----------------- */}
        <Row className="align-items-center">
          <Col className="mb-2">
            <ButtonGroup>
              <Button
                variant="secondary"
                onClick={() => router.push(`/dashboard/awards/${award.id}/edit`)}
              >
                <FontAwesomeIcon icon={faPen} className="me-1" /> { t('edit') }
              </Button>
              <Button
                variant={award.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                onClick={award.status === DocumentStatus.ACTIVE ? handleDeactivate : handleActivate}
                disabled={isPendingActivate || isPendingDeactivate}
              >
                <FontAwesomeIcon
                  icon={award.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                  className="list-icon"
                />{" "}
                {award.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
              </Button>
            </ButtonGroup>
          </Col>
          <Col xs="auto" className="mb-2">
            <Button
              variant="danger"
              className="me-2"
              onClick={() => setDeleteModalShow(true)}
              disabled={isPendingDelete}
            >
              <FontAwesomeIcon icon={faTrash} className="list-icon" /> { t('delete') }
            </Button>
          </Col>
        </Row>
        {isActivateError && activateError && (
          <Row className="my-3">
            <Col>
              <Alert variant="danger" dismissible>
                <Alert.Heading>{t('activateErrorTitle')}</Alert.Heading>
                <p>{activateError.message}</p>
              </Alert>
            </Col>
          </Row>
        )}
        {isDeactivateError && deactivateError && (
          <Row className="my-3">
            <Col>
              <Alert variant="danger" dismissible>
                <Alert.Heading>{t('deactivateErrorTitle')}</Alert.Heading>
                <p>{deactivateError.message}</p>
              </Alert>
            </Col>
          </Row>
        )}
        {isDeleteError && deleteError && (
          <Row className="my-3">
            <Col>
              <Alert variant="danger" dismissible>
                <Alert.Heading>{t('deleteErrorTitle')}</Alert.Heading>
                <p>{deleteError.message}</p>
              </Alert>
            </Col>
          </Row>
        )}
        <DeleteModal
          title={t('deleteModalTitle')}
          description={
            t.rich('deleteModalMessage', {
              strong: () => <strong>{selectedTitle}</strong>,
            })
          }
          cancelText={t('deleteModalCancel')}
          confirmText={t('deleteModalAccept')}
          show={deleteModalShow}
          onHide={() => setDeleteModalShow(false)}
          onConfirm={handleDeleteAward}
        />
      </div>
    </>
  );
}

export default AwardOptionsViewer;