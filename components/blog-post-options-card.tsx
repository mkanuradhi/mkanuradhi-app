"use client";
import Link from "next/link";
import { Alert, Button, Card, Col, Modal, Row } from "react-bootstrap";
import { useLocale, useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader, faEye, faEyeSlash, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useDeleteBlogPostMutation, usePublishBlogPostMutation, useUnpublishBlogPostMutation } from "@/hooks/use-blog-posts";
import DocumentStatus from "@/enums/document-status";
import DeleteModal from "./delete-modal";
import "./blog-post-options-card.scss";


const baseTPath = 'components.BlogPostOptionsCard';

interface BlogPostOptionsCardProps {
  id: string;
  titleEn: string;
  summaryEn: string;
  titleSi: string;
  summarySi: string;
  img?: string;
  path: string;
  status: DocumentStatus;
  dateTime: Date;
}

const BlogPostOptionsCard: React.FC<BlogPostOptionsCardProps> = ({id, titleEn, summaryEn, titleSi, summarySi, img, path, status, dateTime}) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const selectedTitle = locale === "si" ? `'${titleSi}'` : `'${titleEn}'`;

  const { mutate: deleteBlogPostMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteBlogPostMutation();
  const { mutate: publishBlogPostMutation, isPending: isPendingPublish, isError: isPublishError, error: publishError } = usePublishBlogPostMutation();
  const { mutate: unpublishBlogPostMutation, isPending: isPendingUnpublish, isError: isUnpublishError, error: unpublishError } = useUnpublishBlogPostMutation();

  const handleDeleteBlogPost = async () => {
    deleteBlogPostMutation(id);
    setDeleteModalShow(false);
  }

  const handlePublish = () => {
    publishBlogPostMutation(id);
  }

  const handleUnpublish = () => {
    unpublishBlogPostMutation(id);
  }

  return (
    <>
      <Card className="my-3 shadow blog-post-options-card">
        <Row className="g-0 flex-column flex-md-row">
        {img && (
          <Col md={4}>
            <Card.Img
              src={img}
              alt={`Image for ${titleEn}`}
              style={{ objectFit: 'cover', height: '100%', maxHeight: '32rem' }}
            />
          </Col>
          )}
          {/* Right Column for the Content */}
          <Col md={img ? 8 : 12}>
            <Card.Body>
              <Card.Title>
                { titleEn }
              </Card.Title>
              <Card.Title>
                { titleSi }
              </Card.Title>
              <Card.Text className="text-muted fs-7">
                { new Date(dateTime).toLocaleDateString() }
              </Card.Text>
              <hr className="divider" />
              <Card.Text>
                { summaryEn }
              </Card.Text>
              <Card.Text>
                { summarySi }
              </Card.Text>
              <Link href={`blog/${id}`}>
                <Button className="me-2 my-1">
                  <FontAwesomeIcon icon={faBookOpenReader} className="me-1" /> { t('read') }
                </Button>
              </Link>
              <Link href={`blog/${id}/edit`}>
                <Button variant="secondary" className="me-2 my-1">
                  <FontAwesomeIcon icon={faPen} className="me-1" /> { t('edit') }
                </Button>
              </Link>
              <Button
                variant={status === DocumentStatus.ACTIVE ? `warning` : `success`}
                className="me-2 my-1"
                onClick={status === DocumentStatus.ACTIVE ? handleUnpublish : handlePublish}
                disabled={isPendingPublish || isPendingUnpublish}
              >
                <FontAwesomeIcon
                  icon={status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                  className="me-1"
                />{" "}
                {status === DocumentStatus.ACTIVE ? t('unpublish') : t('publish')}
              </Button>
              <Button
                variant="danger"
                className="me-2 my-1"
                onClick={() => setDeleteModalShow(true)}
                disabled={isPendingDelete}
              >
                <FontAwesomeIcon icon={faTrash} className="me-1" /> { t('delete') }
              </Button>
              {isPublishError && publishError && (
                <Alert variant="danger" className="my-2" dismissible>
                  <Alert.Heading>{t('publishErrorTitle')}</Alert.Heading>
                  <p>{publishError.message}</p>
                </Alert>
              )}
              {isUnpublishError && unpublishError && (
                <Alert variant="danger" className="my-2" dismissible>
                  <Alert.Heading>{t('unpublishErrorTitle')}</Alert.Heading>
                  <p>{unpublishError.message}</p>
                </Alert>
              )}
              {isDeleteError && deleteError && (
                <Alert variant="danger" className="my-2" dismissible>
                  <Alert.Heading>{t('deleteErrorTitle')}</Alert.Heading>
                  <p>{deleteError.message}</p>
                </Alert>
              )}
            </Card.Body>
          </Col>
        </Row>
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
        onConfirm={handleDeleteBlogPost}
      />
    </>
  )
}

export default BlogPostOptionsCard;