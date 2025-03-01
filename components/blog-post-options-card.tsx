"use client";
import Link from "next/link";
import { Alert, Button, Card, Col, Modal, Row } from "react-bootstrap";
import { useLocale, useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader, faEye, faEyeSlash, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useDeleteBlogPostMutation, usePublishBlogPostMutation, useUnpublishBlogPostMutation } from "@/hooks/use-blog-posts";
import "./blog-post-options-card.scss";

const baseTPath = 'components.BlogPostOptionsCard';

interface BlogPostCardOptionsProps {
  id: string;
  titleEn: string;
  summaryEn: string;
  titleSi: string;
  summarySi: string;
  img?: string;
  path: string;
  dateTime: Date;
  published: boolean;
}

const BlogPostOptionsCard: React.FC<BlogPostCardOptionsProps> = ({id, titleEn, summaryEn, titleSi, summarySi, img, path, dateTime, published}) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();
  const [show, setShow] = useState(false);

  const selectedTitle = locale === "si" ? `'${titleSi}'` : `'${titleEn}'`;

  const { mutate: deleteBlogPostMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteBlogPostMutation();
  const { mutate: publishBlogPostMutation, isPending: isPendingPublish, isError: isPublishError, error: publishError } = usePublishBlogPostMutation();
  const { mutate: unpublishBlogPostMutation, isPending: isPendingUnpublish, isError: isUnpublishError, error: unpublishError } = useUnpublishBlogPostMutation();

  const handleDeleteBlogPost = async () => {
    deleteBlogPostMutation(id);
    handleClose();
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
                variant={published ? `warning` : `success`}
                className="me-2 my-1"
                onClick={published ? handleUnpublish : handlePublish}
                disabled={isPendingPublish || isPendingUnpublish}
              >
                <FontAwesomeIcon
                  icon={published ? faEyeSlash : faEye}
                  className="me-1"
                />{" "}
                {published ? t('unpublish') : t('publish')}
              </Button>
              <Button
                variant="danger"
                className="me-2 my-1"
                onClick={handleShow}
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
        
        <div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{t('deleteModalTitle')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
                t.rich('deleteModalMessage', {
                  strong: () => <strong>{selectedTitle}</strong>,
                })
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                {t('deleteModalCancel')}
              </Button>
              <Button variant="danger" onClick={handleDeleteBlogPost}>
                {t('deleteModalAccept')}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Card>
    </>
  )
}

export default BlogPostOptionsCard;