"use client";
import { useRouter } from '@/i18n/routing';
import { Alert, Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { useLocale, useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faBookOpenReader, faCertificate, faEye, faEyeSlash, faGift, faGraduationCap, faMoneyCheckDollar, faPen, faPeopleGroup, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import DocumentStatus from "@/enums/document-status";
import Award from '@/interfaces/i-award';
import AwardType from '@/enums/award-type';
import DeleteModal from './delete-modal';
import { useActivateAwardMutation, useDeactivateAwardMutation, useDeleteAwardMutation } from '@/hooks/use-awards';
import SanitizedHtml from './sanitized-html';

const baseTPath = 'components.AwardOptionsCard';

interface AwardOptionsCardProps {
  award: Award;
}

const AwardOptionsCard: React.FC<AwardOptionsCardProps> = ({award}) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const router = useRouter();

  const selectedTitle = 
    locale === "si" 
      ? `${award.year ? award.year + " " : ""}'${award.titleSi ? award.titleSi : award.titleEn}'` 
      : `${award.year ? award.year + " " : ""}'${award.titleEn}'`;

  const { mutate: deleteAwardMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteAwardMutation();
  const { mutate: activateAwardMutation, isPending: isPendingActivate, isError: isActivateError, error: activateError } = useActivateAwardMutation();
  const { mutate: deactivateAwardMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivateAwardMutation();

  const handleDeleteAward = async () => {
    deleteAwardMutation(award.id);
    setDeleteModalShow(false)
  }

  const handleActivate = () => {
    activateAwardMutation(award.id);
  }

  const handleDeativate = () => {
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
      <Card className="my-3 shadow award-options-card">
        <Card.Body>
          <Card.Subtitle className="my-2">
            <Row className="align-items-center">
              <Col>
                <span>{award.year}</span>
              </Col>
              <Col xs="auto">
                <span className="me-2">{t(`awardType.${award.type.toLowerCase()}`)}</span>
                {getTypeIcon()}
              </Col>
            </Row>
          </Card.Subtitle>
          <Card.Title>
            { award.titleEn && `${award.titleEn} ` }
          </Card.Title>
          <Card.Title>
            { award.titleSi && `${award.titleSi} ` }
          </Card.Title>
          <hr />
          {award.descriptionEn && (
            <Row>
              <Col>
                <SanitizedHtml html={award.descriptionEn} />
              </Col>
            </Row>
          )}
          {award.descriptionSi && (
            <Row>
              <Col>
                <SanitizedHtml html={award.descriptionSi} />
              </Col>
            </Row>
          )}
          <Row className="align-items-center">
            <Col className="mb-2">
              <ButtonGroup>
                <Button
                  variant="primary"
                  aria-label={t('read')}
                  onClick={() => router.push(`awards/${award.id}`)}
                >
                  <FontAwesomeIcon icon={faBookOpenReader} className="me-1" />
                  <span className="d-none d-sm-inline">{t('read')}</span>
                </Button>
                <Button
                  variant="secondary"
                  aria-label={t('edit')}
                  onClick={() => router.push(`awards/${award.id}/edit`)}
                >
                  <FontAwesomeIcon icon={faPen} className="me-1" />
                  <span className="d-none d-sm-inline">{t('edit')}</span>
                </Button>
                <Button
                  variant={award.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                  aria-label={award.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
                  onClick={award.status === DocumentStatus.ACTIVE ? handleDeativate : handleActivate}
                  disabled={isPendingActivate || isPendingDeactivate}
                >
                  <FontAwesomeIcon
                    icon={award.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                    className="me-1"
                  />
                  <span className="d-none d-sm-inline">
                    {award.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
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
                <FontAwesomeIcon icon={faTrash} className="me-1" />
                <span className="d-none d-sm-inline">{t('delete')}</span>
              </Button>
            </Col>
          </Row>
          {isActivateError && activateError && (
            <Alert variant="danger" className="my-2" dismissible>
              <Alert.Heading>{t('activateErrorTitle')}</Alert.Heading>
              <p>{activateError.message}</p>
            </Alert>
          )}
          {isDeactivateError && deactivateError && (
            <Alert variant="danger" className="my-2" dismissible>
              <Alert.Heading>{t('deactivateErrorTitle')}</Alert.Heading>
              <p>{deactivateError.message}</p>
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
            strong: () => <strong>{selectedTitle}</strong>,
          })
        }
        cancelText={t('deleteModalCancel')}
        confirmText={t('deleteModalAccept')}
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        onConfirm={handleDeleteAward}
      />
    </>
  )
}

export default AwardOptionsCard;